import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { LevelSelector } from "../src/components/LevelSelector";

const mockJobState = {
  level: "medium",
  setLevel: vi.fn(),
  stage: "IDLE",
};

vi.mock("../src/context/JobContext", () => ({
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

describe("LevelSelector", () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    mockJobState.level = "medium";
    mockJobState.setLevel = vi.fn();
    mockJobState.stage = "IDLE";
  });

  it("renders all three optimization levels", () => {
    render(<LevelSelector />);
    expect(screen.getByText(/low/i)).toBeInTheDocument();
    expect(screen.getByText(/medium/i)).toBeInTheDocument();
    expect(screen.getByText(/high/i)).toBeInTheDocument();
  });

  it("marks the currently active level as selected", () => {
    render(<LevelSelector />);
    const mediumBtn = screen.getByText(/medium/i).closest("button");
    expect(mediumBtn.className).toMatch(/bg-blue|selected|active/i);
  });

  it("calls setLevel with 'low' when low is clicked", () => {
    render(<LevelSelector />);
    fireEvent.click(screen.getByText(/low/i));
    expect(mockJobState.setLevel).toHaveBeenCalledWith("low");
  });

  it("calls setLevel with 'high' when high is clicked", () => {
    render(<LevelSelector />);
    fireEvent.click(screen.getByText(/high/i));
    expect(mockJobState.setLevel).toHaveBeenCalledWith("high");
  });
});
