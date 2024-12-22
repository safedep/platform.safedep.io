import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";
import { createError } from "../schema/error";

export const apiErrorHandler =
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  (...handlers: Function[]) =>
    async (req: NextRequest) => {
      try {
        for (const handler of handlers) {
          return await handler(req);
        }
      } catch (error) {
        if (error instanceof ApiError) {
          return NextResponse.json(
            createError(error.message, [
              { message: error.message, status: error.statusCode },
            ]),
            { status: error.statusCode },
          );
        } else if (error instanceof Error) {
          return NextResponse.json(
            createError(error.message, [{ message: error.message }]),
            { status: 500 },
          );
        } else {
          return NextResponse.json(
            createError("Internal server error", [
              { message: "Internal server error" },
            ]),
            { status: 500 },
          );
        }
      }
    };
