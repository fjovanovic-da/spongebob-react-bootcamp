import { beforeEach, describe, expect, it } from "vitest";
import { useFilterStore } from "../../stores/useFilterStore";

describe("useFilterStore", () => {
    beforeEach(() => {
        // Reset store state before each test
        useFilterStore.setState({ searchText: "", roleFilter: "" });
    });

    describe("initial state", () => {
        it("should have empty searchText", () => {
            const { searchText } = useFilterStore.getState();
            expect(searchText).toBe("");
        });

        it("should have empty roleFilter", () => {
            const { roleFilter } = useFilterStore.getState();
            expect(roleFilter).toBe("");
        });
    });

    describe("setSearchText", () => {
        it("should update searchText", () => {
            const { setSearchText } = useFilterStore.getState();

            setSearchText("SpongeBob");

            const { searchText } = useFilterStore.getState();
            expect(searchText).toBe("SpongeBob");
        });

        it("should overwrite previous searchText", () => {
            const { setSearchText } = useFilterStore.getState();

            setSearchText("SpongeBob");
            setSearchText("Patrick");

            const { searchText } = useFilterStore.getState();
            expect(searchText).toBe("Patrick");
        });

        it("should handle empty string", () => {
            const { setSearchText } = useFilterStore.getState();

            setSearchText("SpongeBob");
            setSearchText("");

            const { searchText } = useFilterStore.getState();
            expect(searchText).toBe("");
        });

        it("should handle special characters", () => {
            const { setSearchText } = useFilterStore.getState();

            setSearchText("Mr. Krabs $$$");

            const { searchText } = useFilterStore.getState();
            expect(searchText).toBe("Mr. Krabs $$$");
        });
    });

    describe("setRoleFilter", () => {
        it("should update roleFilter", () => {
            const { setRoleFilter } = useFilterStore.getState();

            setRoleFilter("fry-cook");

            const { roleFilter } = useFilterStore.getState();
            expect(roleFilter).toBe("fry-cook");
        });

        it("should overwrite previous roleFilter", () => {
            const { setRoleFilter } = useFilterStore.getState();

            setRoleFilter("fry-cook");
            setRoleFilter("cashier");

            const { roleFilter } = useFilterStore.getState();
            expect(roleFilter).toBe("cashier");
        });

        it("should handle empty string to clear filter", () => {
            const { setRoleFilter } = useFilterStore.getState();

            setRoleFilter("fry-cook");
            setRoleFilter("");

            const { roleFilter } = useFilterStore.getState();
            expect(roleFilter).toBe("");
        });
    });

    describe("independent state updates", () => {
        it("should update searchText without affecting roleFilter", () => {
            const { setSearchText, setRoleFilter } = useFilterStore.getState();

            setRoleFilter("manager");
            setSearchText("Squidward");

            const { searchText, roleFilter } = useFilterStore.getState();
            expect(searchText).toBe("Squidward");
            expect(roleFilter).toBe("manager");
        });

        it("should update roleFilter without affecting searchText", () => {
            const { setSearchText, setRoleFilter } = useFilterStore.getState();

            setSearchText("Gary");
            setRoleFilter("pet");

            const { searchText, roleFilter } = useFilterStore.getState();
            expect(searchText).toBe("Gary");
            expect(roleFilter).toBe("pet");
        });
    });
});
