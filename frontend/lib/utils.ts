import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getApiErrorMessage = (error: FetchBaseQueryError | SerializedError | unknown) => {
  if (typeof error === "object" && error && "data" in error) {
    const data = (error as FetchBaseQueryError).data;

    if (typeof data === "string") {
      return data;
    }

    if (typeof data === "object" && data) {
      if ("message" in data && typeof data.message === "string") {
        return data.message;
      }

      if ("errors" in data && typeof data.errors === "object" && data.errors) {
        const firstError = Object.values(data.errors)[0];

        if (Array.isArray(firstError) && typeof firstError[0] === "string") {
          return firstError[0];
        }
      }
    }
  }

  if (typeof error === "object" && error && "message" in error && typeof error.message === "string") {
    return error.message;
  }

  return "Unable to complete the request. Please try again.";
};