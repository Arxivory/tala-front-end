import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import OfflineAssistant from "@/components/tala-sections/assistant";

describe("TALA Knowledge Assistant", () => {
  it("shows a prepared answer and opens its clearly labeled source summary", () => {
    render(<OfflineAssistant />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /Why are exercise countermeasures important during long-duration spaceflight/,
      }),
    );

    expect(screen.getByText("Prepared demonstration response")).toBeInTheDocument();
    expect(
      screen.getByText(/does not independently measure physiological adaptation/),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "NASA-STD-3001-V2" }));

    expect(screen.getByText("Prepared source summary")).toBeInTheDocument();
    expect(screen.getByText(/not a live retrieved excerpt/)).toBeInTheDocument();
    expect(screen.queryByText(/Section \d|Page \d/)).not.toBeInTheDocument();
  });

  it("answers custom questions with the demonstration-mode notice", () => {
    render(<OfflineAssistant />);

    fireEvent.change(screen.getByRole("textbox", { name: "Ask a question" }), {
      target: { value: "Can you analyze my personal health?" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    expect(screen.getByText("Can you analyze my personal health?")).toBeInTheDocument();
    expect(screen.getByText("Demonstration mode")).toBeInTheDocument();
    expect(screen.getByText(/Free-form AI generation is not enabled/)).toBeInTheDocument();
  });

  it("lists the six knowledge sources without claiming vector counts", () => {
    render(<OfflineAssistant />);

    fireEvent.click(screen.getByRole("button", { name: "Knowledge Sources (6)" }));

    expect(screen.getByText("TALA Research Knowledge Base")).toBeInTheDocument();
    expect(screen.getAllByText("Included in RAG knowledge base")).toHaveLength(6);
    expect(screen.queryByText(/vector chunks|Verified against/)).not.toBeInTheDocument();
  });
});
