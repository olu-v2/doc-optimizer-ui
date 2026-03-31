import dotenv from "dotenv";
import fs from "fs";
import {
  AddPermissionCommand,
  CreateFunctionCommand,
  CreateFunctionUrlConfigCommand,
  LambdaClient,
  GetFunctionUrlConfigCommand,
  UpdateFunctionCodeCommand,
} from "@aws-sdk/client-lambda";

dotenv.config({ override: true });

// allow region, role and function name to be provided via environment variables
const client = new LambdaClient({
  region: process.env.AWS_REGION || "us-east-1",
});

async function createLambda() {
  const roleArn = process.env.LAMBDA_ROLE_ARN;

  const functionName = `preview-${process.env.LAMBDA_FUNCTION_NAME}-optimize-fe`;
  const zipFile = fs.readFileSync("./function.zip");

  try {
    const createCommand = new CreateFunctionCommand({
      FunctionName: functionName,
      Runtime: "nodejs22.x",
      Role: roleArn,
      Handler: "app.handler",
      Code: { ZipFile: zipFile },
      Description: "Doc Optimize FE",
      Timeout: 10,
      MemorySize: 128,
    });
    const result = await client.send(createCommand);
    console.log("Lambda created", result.FunctionArn);
  } catch (error) {
    if (error.name === "ResourceConflictException") {
      console.log("Function exists — updating code instead...");
      const updateCommand = new UpdateFunctionCodeCommand({
        FunctionName: functionName,
        ZipFile: zipFile,
      });
      await client.send(updateCommand);
      console.log("Lambda code updated.");
    } else {
      throw error;
    }
  }

  let functionUrl;
  try {
    const getUrl = await client.send(
      new GetFunctionUrlConfigCommand({ FunctionName: functionName }),
    );
    functionUrl = getUrl.FunctionUrl;
    console.log("🔗 Function URL already exists:", functionUrl);
  } catch {
    console.log("Creating new Function URL...");
    const urlCommand = new CreateFunctionUrlConfigCommand({
      FunctionName: functionName,
      AuthType: "NONE",
      Cors: {
        AllowOrigins: ["*"],
        AllowMethods: ["GET", "POST"],
      },
    });
    const urlResult = await client.send(urlCommand);
    functionUrl = urlResult.FunctionUrl;
    console.log("New Function URL created:", functionUrl);
  }

  try {
    const lambdaPermissions = [
      {
        Action: "lambda:InvokeFunctionUrl",
        Principal: "*",
        StatementId: "PublicAccess",
        FunctionUrlAuthType: "NONE",
      },
      {
        Action: "lambda:InvokeFunction",
        Principal: "*",
        StatementId: `PublicInvokeFunction`,
      },
    ];
    for (const perm of lambdaPermissions) {
      try {
        await client.send(
          new AddPermissionCommand({ FunctionName: functionName, ...perm }),
        );
        console.log(`Permission added: ${perm.StatementId}`);
      } catch (err) {
        if (err.name === "ResourceConflictException") {
          console.log(`Permission already exists: ${perm.StatementId}`);
        } else {
          throw err;
        }
      }
    }
  } catch (err) {
    if (err.name === "ResourceConflictException") {
      console.log("Permission already exists.");
    } else {
      throw err;
    }
  }

  console.log("\n Function ready at:", functionUrl);
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(
      process.env.GITHUB_OUTPUT,
      `function_url=${functionUrl}\n`,
    );
  }
}

createLambda().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
