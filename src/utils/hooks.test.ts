import { describe, it, expect } from "vitest";
import { ConnectionConfiguration } from "@hocuspocus/server";
import { handleReadOnlyMode } from "./hooks";
import { PrismockClient } from "prismock";
import { createExampleDocument } from "../../tests/helpers/documentHelpers";
import { randomUUID } from "crypto";
const prisma = new PrismockClient();

describe("handleReadOnlyMode", () => {
  it("should set readOnly mode to true when modificationSecret is empty", async () => {
    const connectionConfiguration = buildConnectionConfiguration();

    await handleReadOnlyMode(
      prisma,
      "documentName",
      connectionConfiguration,
      null,
    );

    expect(connectionConfiguration.readOnly).toBeTruthy();
  });

  it("should set readOnly mode to true when modificationSecret is invalid", async () => {
    const connectionConfiguration = buildConnectionConfiguration();

    await handleReadOnlyMode(
      prisma,
      "documentName",
      connectionConfiguration,
      "invalid",
    );

    expect(connectionConfiguration.readOnly).toBeTruthy();
  });

  it("should set readOnly mode to true when modificationSecret is set to readOnly", async () => {
    const connectionConfiguration = buildConnectionConfiguration();

    await handleReadOnlyMode(
      prisma,
      "documentName",
      connectionConfiguration,
      "readOnly",
    );

    expect(connectionConfiguration.readOnly).toBeTruthy();
  });

  it("should set readOnly mode to false when modificationSecret is valid", async () => {
    const document = await createExampleDocument(prisma);

    const connectionConfiguration = buildConnectionConfiguration();

    await handleReadOnlyMode(
      prisma,
      document.id,
      connectionConfiguration,
      document.modificationSecret,
    );

    expect(connectionConfiguration.readOnly).toBeFalsy();
  });

  it("should return undefined the document is missing", async () => {
    const connectionConfiguration = buildConnectionConfiguration();

    expect(
      await handleReadOnlyMode(
        prisma,
        randomUUID(),
        connectionConfiguration,
        randomUUID(),
      ),
    ).toBeUndefined();
  });
});

const buildConnectionConfiguration = (): ConnectionConfiguration => {
  return {
    readOnly: false,
    isAuthenticated: false,
  };
};
