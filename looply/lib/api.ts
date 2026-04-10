import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getCurrentUser } from "@/lib/auth";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function jsonError(message: string, status = 400, issues?: string[]) {
  return NextResponse.json(
    {
      error: message,
      issues
    },
    { status }
  );
}

export function jsonSuccess<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export async function requireApiUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new ApiError(401, "Necesitas iniciar sesión para continuar.");
  }

  return user;
}

export function parseCursor(value: string | null) {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export function parseLimit(value: string | null, fallback = 10, max = 20) {
  if (!value) return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, max);
}

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return jsonError(error.message, error.status);
  }

  if (error instanceof ZodError) {
    return jsonError(
      "Revisa los datos enviados e inténtalo de nuevo.",
      422,
      error.issues.map((issue) => issue.message)
    );
  }

  if (error instanceof Error && error.message === "UNAUTHORIZED") {
    return jsonError("Necesitas iniciar sesión para continuar.", 401);
  }

  console.error(error);
  return jsonError("Algo salió mal en Looply. Inténtalo de nuevo en unos segundos.", 500);
}
