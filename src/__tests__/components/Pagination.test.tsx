import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Pagination from "../../components/Pagination";

describe("Pagination", () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 10,
    onPageChange: vi.fn(),
    itemsPerPage: 6,
    totalItems: 60,
  };

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("should not render when totalPages is 1", () => {
      const { container } = render(
        <Pagination {...defaultProps} totalPages={1} totalItems={6} />
      );

      expect(container.firstChild).toBeNull();
    });

    it("should not render when totalPages is 0", () => {
      const { container } = render(
        <Pagination {...defaultProps} totalPages={0} totalItems={0} />
      );

      expect(container.firstChild).toBeNull();
    });

    it("should render pagination controls when totalPages > 1", () => {
      render(<Pagination {...defaultProps} />);

      expect(screen.getByText("«")).toBeInTheDocument();
      expect(screen.getByText("»")).toBeInTheDocument();
    });

    it("should display items info correctly", () => {
      render(<Pagination {...defaultProps} />);

      const infoText = screen.getByText(/Showing.*to.*of.*items/);
      expect(infoText).toBeInTheDocument();
      expect(infoText).toHaveTextContent("Showing 1 to 6 of 60 items");
    });

    it("should display correct items range for middle page", () => {
      render(<Pagination {...defaultProps} currentPage={3} totalItems={60} />);

      // Page 3 with 6 items per page: items 13-18
      const infoText = screen.getByText(/Showing.*to.*of.*items/);
      expect(infoText).toHaveTextContent("Showing 13 to 18 of 60 items");
    });

    it("should display correct items range for last page with partial items", () => {
      render(
        <Pagination
          {...defaultProps}
          currentPage={10}
          totalPages={10}
          totalItems={58}
        />
      );

      // Page 10 with 6 items per page, 58 total: items 55-58
      const infoText = screen.getByText(/Showing.*to.*of.*items/);
      expect(infoText).toHaveTextContent("Showing 55 to 58 of 58 items");
    });
  });

  describe("page numbers generation", () => {
    it("should show all pages when totalPages <= 5", () => {
      render(<Pagination {...defaultProps} totalPages={5} />);

      expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "4" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "5" })).toBeInTheDocument();
      expect(screen.queryByText("...")).not.toBeInTheDocument();
    });

    it("should show ellipsis at end when currentPage <= 3", () => {
      render(<Pagination {...defaultProps} currentPage={2} />);

      expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "4" })).toBeInTheDocument();
      expect(screen.getByText("...")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "10" })).toBeInTheDocument();
    });

    it("should show ellipsis at start when currentPage >= totalPages - 2", () => {
      render(<Pagination {...defaultProps} currentPage={9} />);

      expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
      expect(screen.getByText("...")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "7" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "8" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "9" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "10" })).toBeInTheDocument();
    });

    it("should show ellipsis on both sides when currentPage is in middle", () => {
      render(<Pagination {...defaultProps} currentPage={5} />);

      expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
      expect(screen.getAllByText("...")).toHaveLength(2);
      expect(screen.getByRole("button", { name: "4" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "5" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "6" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "10" })).toBeInTheDocument();
    });
  });

  describe("navigation buttons", () => {
    it("should disable previous button on first page", () => {
      render(<Pagination {...defaultProps} currentPage={1} />);

      const prevButton = screen.getByText("«");
      expect(prevButton).toBeDisabled();
    });

    it("should disable next button on last page", () => {
      render(<Pagination {...defaultProps} currentPage={10} />);

      const nextButton = screen.getByText("»");
      expect(nextButton).toBeDisabled();
    });

    it("should enable both buttons on middle page", () => {
      render(<Pagination {...defaultProps} currentPage={5} />);

      const prevButton = screen.getByText("«");
      const nextButton = screen.getByText("»");
      expect(prevButton).not.toBeDisabled();
      expect(nextButton).not.toBeDisabled();
    });
  });

  describe("interactions", () => {
    it("should call onPageChange with previous page when clicking previous", () => {
      const onPageChange = vi.fn();
      render(
        <Pagination
          {...defaultProps}
          currentPage={5}
          onPageChange={onPageChange}
        />
      );

      fireEvent.click(screen.getByText("«"));

      expect(onPageChange).toHaveBeenCalledWith(4);
    });

    it("should call onPageChange with next page when clicking next", () => {
      const onPageChange = vi.fn();
      render(
        <Pagination
          {...defaultProps}
          currentPage={5}
          onPageChange={onPageChange}
        />
      );

      fireEvent.click(screen.getByText("»"));

      expect(onPageChange).toHaveBeenCalledWith(6);
    });

    it("should call onPageChange with specific page when clicking page number", () => {
      const onPageChange = vi.fn();
      render(
        <Pagination
          {...defaultProps}
          currentPage={1}
          onPageChange={onPageChange}
        />
      );

      fireEvent.click(screen.getByRole("button", { name: "3" }));

      expect(onPageChange).toHaveBeenCalledWith(3);
    });

    it("should not call onPageChange when clicking disabled previous button", () => {
      const onPageChange = vi.fn();
      render(
        <Pagination
          {...defaultProps}
          currentPage={1}
          onPageChange={onPageChange}
        />
      );

      const prevButton = screen.getByText("«");
      fireEvent.click(prevButton);

      expect(onPageChange).not.toHaveBeenCalled();
    });

    it("should not call onPageChange when clicking disabled next button", () => {
      const onPageChange = vi.fn();
      render(
        <Pagination
          {...defaultProps}
          currentPage={10}
          onPageChange={onPageChange}
        />
      );

      const nextButton = screen.getByText("»");
      fireEvent.click(nextButton);

      expect(onPageChange).not.toHaveBeenCalled();
    });

    it("should not call onPageChange when clicking ellipsis", () => {
      const onPageChange = vi.fn();
      render(
        <Pagination
          {...defaultProps}
          currentPage={5}
          onPageChange={onPageChange}
        />
      );

      const ellipsisButtons = screen.getAllByText("...");
      fireEvent.click(ellipsisButtons[0]);

      expect(onPageChange).not.toHaveBeenCalled();
    });
  });

  describe("current page styling", () => {
    it("should highlight the current page button", () => {
      render(<Pagination {...defaultProps} currentPage={3} />);

      const currentPageButton = screen.getByRole("button", { name: "3" });
      expect(currentPageButton).toHaveClass("btn-primary");
      expect(currentPageButton).toHaveClass("font-bold");
    });

    it("should not highlight non-current page buttons", () => {
      render(<Pagination {...defaultProps} currentPage={3} />);

      const otherPageButton = screen.getByRole("button", { name: "4" });
      expect(otherPageButton).not.toHaveClass("btn-primary");
      expect(otherPageButton).toHaveClass("btn-ghost");
    });
  });

  describe("edge cases", () => {
    it("should handle single item correctly", () => {
      render(
        <Pagination
          {...defaultProps}
          currentPage={1}
          totalPages={1}
          totalItems={1}
        />
      );

      // Should not render when only 1 page
      expect(screen.queryByText("«")).not.toBeInTheDocument();
    });

    it("should handle exactly 2 pages", () => {
      render(
        <Pagination
          {...defaultProps}
          currentPage={1}
          totalPages={2}
          totalItems={12}
        />
      );

      expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
      expect(screen.queryByText("...")).not.toBeInTheDocument();
    });

    it("should handle boundary case at page 3", () => {
      render(<Pagination {...defaultProps} currentPage={3} />);

      // Page 3 should still show first 4 pages + ellipsis + last page
      expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "4" })).toBeInTheDocument();
      expect(screen.getByText("...")).toBeInTheDocument();
    });

    it("should handle boundary case at page totalPages - 2", () => {
      render(<Pagination {...defaultProps} currentPage={8} />);

      // Page 8 (totalPages - 2) should show: 1, ..., 7, 8, 9, 10
      expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
      expect(screen.getByText("...")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "7" })).toBeInTheDocument();
    });
  });
});
