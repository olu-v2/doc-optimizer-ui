import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { FileDropzone } from "../src/components/FileDropzone";

const mockJobState = {
  file: null,
  setFile: vi.fn(),
  stage: "IDLE",
};

vi.mock("../src/context/JobContext", () => ({
  //Export STAGES exactly as your real JobContext defines it
  STAGES: {
    IDLE: "IDLE",
    UPLOADING: "UPLOADING",
    PROCESSING: "PROCESSING",
    VERIFYING: "VERIFYING",
    DONE: "DONE",
    FAILED: "FAILED",
  },
  useJob: () => mockJobState,
}));

describe("FileDropzone", () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    mockJobState.file = null;
    mockJobState.setFile = vi.fn();
    mockJobState.stage = "IDLE";
  });

  it("renders the dropzone with upload prompt", () => {
    render(<FileDropzone />);
    expect(
      screen.getByText(/drag & drop|click to upload/i),
    ).toBeInTheDocument();
  });

  it("accepts a valid PDF file and calls setFile", () => {
    render(<FileDropzone />);
    const input = document.querySelector('input[type="file"]');
    const file = new File(["content"], "report.pdf", {
      type: "application/pdf",
    });
    fireEvent.change(input, { target: { files: [file] } });
    expect(mockJobState.setFile).toHaveBeenCalledWith(file);
  });

  it("accepts a valid DOCX file and calls setFile", () => {
    render(<FileDropzone />);
    const input = document.querySelector('input[type="file"]');
    const file = new File(["content"], "report.docx", {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    fireEvent.change(input, { target: { files: [file] } });
    expect(mockJobState.setFile).toHaveBeenCalledWith(file);
  });

  it("rejects a non-PDF/DOCX file and does not call setFile", () => {
    render(<FileDropzone />);
    const input = document.querySelector('input[type="file"]');
    const file = new File(["content"], "image.png", { type: "image/png" });
    fireEvent.change(input, { target: { files: [file] } });
    expect(mockJobState.setFile).not.toHaveBeenCalled();
  });

  it("displays the selected file name when a file is provided", () => {
    mockJobState.file = new File([""], "mydoc.pdf", {
      type: "application/pdf",
    });
    render(<FileDropzone />);
    expect(screen.getByText(/mydoc\.pdf/i)).toBeInTheDocument();
  });
});
