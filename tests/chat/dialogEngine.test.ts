import { describe, it, expect } from "vitest";
import { extractEntities, advanceDialog } from "@/lib/chat/dialogEngine";
import { DialogState } from "@/lib/chat/types";

describe("Conversational Dialog Engine", () => {
  describe("Entity Extraction", () => {
    it("should extract project costs in Lakhs format", () => {
      const extracted1 = extractEntities("I want to set up a workshop with 1.4 lakhs budget");
      expect(extracted1.estimatedCost).toBe(140000);

      const extracted2 = extractEntities("Need 5 lakh loan for machinery");
      expect(extracted2.estimatedCost).toBe(500000);
    });

    it("should extract raw digit rupee amounts", () => {
      const extracted = extractEntities("My project cost is ₹75,000");
      expect(extracted.estimatedCost).toBe(75000);
    });

    it("should extract annual family income when specified", () => {
      const extracted = extractEntities("Our annual family income is 2.5 lakhs");
      expect(extracted.annualFamilyIncome).toBe(250000);
    });

    it("should identify female gender for affirmative action schemes", () => {
      expect(extractEntities("I am a female entrepreneur").gender).toBe("FEMALE");
      expect(extractEntities("महिला सिलाई केंद्र").gender).toBe("FEMALE");
      expect(extractEntities("Woman artisan").gender).toBe("FEMALE");
    });

    it("should identify student applicant status for educational loans", () => {
      const extracted = extractEntities("I am a student applying for university college");
      expect(extracted.targetGroup).toBe("SC_STUDENTS");
      expect(extracted.educationLevel).toBe("GRADUATE");
    });
  });

  describe("Multi-Turn Dialog State Machine", () => {
    it("should progressively advance from GREETING to EVALUATION_COMPLETE", () => {
      let state: DialogState = {
        currentStep: "GREETING",
        collectedProfile: {},
        language: "en-IN",
        autoSpeak: false,
      };

      // Turn 1: Activity
      const turn1 = advanceDialog(state, "Small tailoring shop");
      expect(turn1.nextState.currentStep).toBe("COLLECT_ACTIVITY");
      expect(turn1.assistantReply).toContain("estimated total project");
      state = turn1.nextState;

      // Turn 2: Cost
      const turn2 = advanceDialog(state, "₹1,20,000");
      expect(turn2.nextState.currentStep).toBe("COLLECT_COST");
      expect(turn2.assistantReply).toContain("annual family income");
      state = turn2.nextState;

      // Turn 3: Income
      const turn3 = advanceDialog(state, "₹2,00,000 per annum");
      expect(turn3.nextState.currentStep).toBe("COLLECT_INCOME");
      expect(turn3.assistantReply).toContain("gender");
      state = turn3.nextState;

      // Turn 4: Gender / Student
      const turn4 = advanceDialog(state, "Female entrepreneur");
      expect(turn4.nextState.currentStep).toBe("EVALUATION_COMPLETE");
      expect(turn4.widgetData).toBeDefined();
      expect(turn4.widgetData?.evaluationResult.isEligible).toBe(true);
      expect(turn4.widgetData?.evaluationResult.primaryScheme?.code).toBe("MSY");
    });

    it("should reset dialog state when user asks to restart", () => {
      const state: DialogState = {
        currentStep: "COLLECT_INCOME",
        collectedProfile: { estimatedCost: 100000 },
        language: "en-IN",
        autoSpeak: false,
      };

      const result = advanceDialog(state, "Please restart conversation");
      expect(result.nextState.currentStep).toBe("GREETING");
      expect(Object.keys(result.nextState.collectedProfile).length).toBe(0);
    });

    it("should generate bilingual Hindi responses when language is hi-IN", () => {
      const state: DialogState = {
        currentStep: "GREETING",
        collectedProfile: {},
        language: "hi-IN",
        autoSpeak: false,
      };

      const result = advanceDialog(state, "किराना दुकान");
      expect(result.nextState.language).toBe("hi-IN");
      expect(result.assistantReply).toContain("लागत");
    });
  });
});
