/**
 * This setup file is used to configure the testing environment for the project.
 * It is specified in the `setupFiles` configuration option of Vitest.
 */
import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// User event and testing-library expect jest be available. We know that vitest
// is jest compatible so we stub it.
// https://github.com/testing-library/user-event/issues/1115#issuecomment-2495876991
// https://github.com/testing-library/user-event/issues/1115#issuecomment-2495876991
vi.stubGlobal("jest", {
  advanceTimersByTime: vi.advanceTimersByTime.bind(vi),
});
