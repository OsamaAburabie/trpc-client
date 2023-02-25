// utils/trpc.ts
import {
  createTRPCReact,
  inferReactQueryProcedureOptions,
} from "@trpc/react-query";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../../../trpc-backend/trpc/router";
export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
export const trpc = createTRPCReact<AppRouter>();
