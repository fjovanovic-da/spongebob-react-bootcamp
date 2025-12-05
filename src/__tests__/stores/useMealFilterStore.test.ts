import { beforeEach, describe, expect, it } from "vitest";
import { useMealFilterStore } from "../../stores/useMealFilterStore";

describe("useMealFilterStore", () => {
    beforeEach(() => {
        // Reset store state before each test
        useMealFilterStore.setState({
            searchText: "",
            categoryFilter: "",
            originFilter: "",
        });
    });

    describe("initial state", () => {
        it("should have empty searchText", () => {
            const { searchText } = useMealFilterStore.getState();
            expect(searchText).toBe("");
        });

        it("should have empty categoryFilter", () => {
            const { categoryFilter } = useMealFilterStore.getState();
            expect(categoryFilter).toBe("");
        });

        it("should have empty originFilter", () => {
            const { originFilter } = useMealFilterStore.getState();
            expect(originFilter).toBe("");
        });
    });

    describe("setSearchText", () => {
        it("should update searchText", () => {
            const { setSearchText } = useMealFilterStore.getState();

            setSearchText("Krabby Patty");

            const { searchText } = useMealFilterStore.getState();
            expect(searchText).toBe("Krabby Patty");
        });

        it("should overwrite previous searchText", () => {
            const { setSearchText } = useMealFilterStore.getState();

            setSearchText("Krabby Patty");
            setSearchText("Kelp Shake");

            const { searchText } = useMealFilterStore.getState();
            expect(searchText).toBe("Kelp Shake");
        });

        it("should handle empty string", () => {
            const { setSearchText } = useMealFilterStore.getState();

            setSearchText("Krabby Patty");
            setSearchText("");

            const { searchText } = useMealFilterStore.getState();
            expect(searchText).toBe("");
        });
    });

    describe("setCategoryFilter", () => {
        it("should update categoryFilter", () => {
            const { setCategoryFilter } = useMealFilterStore.getState();

            setCategoryFilter("Seafood");

            const { categoryFilter } = useMealFilterStore.getState();
            expect(categoryFilter).toBe("Seafood");
        });

        it("should overwrite previous categoryFilter", () => {
            const { setCategoryFilter } = useMealFilterStore.getState();

            setCategoryFilter("Seafood");
            setCategoryFilter("Dessert");

            const { categoryFilter } = useMealFilterStore.getState();
            expect(categoryFilter).toBe("Dessert");
        });

        it("should handle empty string to clear filter", () => {
            const { setCategoryFilter } = useMealFilterStore.getState();

            setCategoryFilter("Seafood");
            setCategoryFilter("");

            const { categoryFilter } = useMealFilterStore.getState();
            expect(categoryFilter).toBe("");
        });
    });

    describe("setOriginFilter", () => {
        it("should update originFilter", () => {
            const { setOriginFilter } = useMealFilterStore.getState();

            setOriginFilter("Bikini Bottom");

            const { originFilter } = useMealFilterStore.getState();
            expect(originFilter).toBe("Bikini Bottom");
        });

        it("should overwrite previous originFilter", () => {
            const { setOriginFilter } = useMealFilterStore.getState();

            setOriginFilter("Bikini Bottom");
            setOriginFilter("Rock Bottom");

            const { originFilter } = useMealFilterStore.getState();
            expect(originFilter).toBe("Rock Bottom");
        });

        it("should handle empty string to clear filter", () => {
            const { setOriginFilter } = useMealFilterStore.getState();

            setOriginFilter("Bikini Bottom");
            setOriginFilter("");

            const { originFilter } = useMealFilterStore.getState();
            expect(originFilter).toBe("");
        });
    });

    describe("independent state updates", () => {
        it("should update searchText without affecting other filters", () => {
            const { setSearchText, setCategoryFilter, setOriginFilter } =
                useMealFilterStore.getState();

            setCategoryFilter("Seafood");
            setOriginFilter("Bikini Bottom");
            setSearchText("Krabby Patty");

            const { searchText, categoryFilter, originFilter } =
                useMealFilterStore.getState();
            expect(searchText).toBe("Krabby Patty");
            expect(categoryFilter).toBe("Seafood");
            expect(originFilter).toBe("Bikini Bottom");
        });

        it("should update categoryFilter without affecting other filters", () => {
            const { setSearchText, setCategoryFilter, setOriginFilter } =
                useMealFilterStore.getState();

            setSearchText("Kelp Shake");
            setOriginFilter("Rock Bottom");
            setCategoryFilter("Beverage");

            const { searchText, categoryFilter, originFilter } =
                useMealFilterStore.getState();
            expect(searchText).toBe("Kelp Shake");
            expect(categoryFilter).toBe("Beverage");
            expect(originFilter).toBe("Rock Bottom");
        });

        it("should update originFilter without affecting other filters", () => {
            const { setSearchText, setCategoryFilter, setOriginFilter } =
                useMealFilterStore.getState();

            setSearchText("Coral Bits");
            setCategoryFilter("Snack");
            setOriginFilter("Goo Lagoon");

            const { searchText, categoryFilter, originFilter } =
                useMealFilterStore.getState();
            expect(searchText).toBe("Coral Bits");
            expect(categoryFilter).toBe("Snack");
            expect(originFilter).toBe("Goo Lagoon");
        });
    });
});
