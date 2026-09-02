import { UserProfile, EvaluationResult } from "@/lib/schemes/types";
import { evaluateEligibility } from "@/lib/schemes/engine";
import {
  DialogState,
  DialogStep,
  QuickPrompt,
} from "./types";
import { DIALOG_PROMPTS } from "./prompts";

export function extractRawAmount(text: string): number | null {
  const lower = text.toLowerCase();
  const lakhMatch = lower.match(/(\d+(\.\d+)?)\s*(lakh|lakhs|lac|lacs|लाख)/i);
  if (lakhMatch) {
    return Math.round(parseFloat(lakhMatch[1]) * 100000);
  }
  const cleaned = text.replace(/₹|,|\s/g, "");
  const numberMatches = cleaned.match(/\d{4,8}/g);
  if (numberMatches && numberMatches.length > 0) {
    return parseInt(numberMatches[0], 10);
  }
  return null;
}

export function extractEntities(text: string): Partial<UserProfile> {
  const result: Partial<UserProfile> = {};
  const lower = text.toLowerCase();

  const amount = extractRawAmount(text);
  if (amount) {
    if (
      lower.includes("income") ||
      lower.includes("आय") ||
      lower.includes("salary") ||
      lower.includes("annum") ||
      lower.includes("p.a.") ||
      lower.includes("वार्षिक")
    ) {
      result.annualFamilyIncome = amount;
    } else {
      result.estimatedCost = amount;
    }
  }

  // 2. Extract Gender
  if (
    /female|woman|women|mahila|aurat|ladki|महिला|स्त्री|लड़की/i.test(lower)
  ) {
    result.gender = "FEMALE";
  } else if (
    /male|man|men|purush|aadmi|ladka|पुरुष|आदमी|लड़का/i.test(lower)
  ) {
    result.gender = "MALE";
  }

  // 3. Extract Student / Education
  if (
    /student|college|university|degree|education|vidyarthi|chhatra|छात्र|विद्यार्थी|शिक्षा|कॉलेज|स्कूल/i.test(
      lower
    )
  ) {
    result.targetGroup = "SC_STUDENTS";
    result.educationLevel = "GRADUATE";
  }

  return result;
}

export function advanceDialog(
  currentState: DialogState,
  userInput: string
): {
  nextState: DialogState;
  assistantReply: string;
  newPrompts: QuickPrompt[];
  widgetData?: {
    evaluationResult: EvaluationResult;
    userProfile: UserProfile;
  };
} {
  const lang = currentState.language;
  const entities = extractEntities(userInput);
  const rawAmount = extractRawAmount(userInput);

  const updatedProfile: Partial<UserProfile> = {
    ...currentState.collectedProfile,
    ...entities,
  };

  let nextStep: DialogStep = currentState.currentStep;

  // Handle restart requests
  if (/restart|new|clear|शुरू|नया/i.test(userInput.toLowerCase())) {
    const greetingData = DIALOG_PROMPTS[lang].GREETING;
    return {
      nextState: {
        currentStep: "GREETING",
        collectedProfile: {},
        language: lang,
        autoSpeak: currentState.autoSpeak,
      },
      assistantReply: greetingData.promptText,
      newPrompts: greetingData.quickPrompts,
    };
  }

  switch (currentState.currentStep) {
    case "GREETING":
      updatedProfile.projectCategory = userInput.trim();
      nextStep = "COLLECT_ACTIVITY";
      break;

    case "COLLECT_ACTIVITY":
      // In this step, user is answering project cost
      if (rawAmount) {
        updatedProfile.estimatedCost = rawAmount;
      } else if (!updatedProfile.estimatedCost) {
        updatedProfile.estimatedCost = 120000;
      }
      nextStep = "COLLECT_COST";
      break;

    case "COLLECT_COST":
      // In this step, user is answering family income
      if (rawAmount) {
        updatedProfile.annualFamilyIncome = rawAmount;
      } else if (!updatedProfile.annualFamilyIncome) {
        updatedProfile.annualFamilyIncome = 240000;
      }
      nextStep = "COLLECT_INCOME";
      break;

    case "COLLECT_INCOME":
    case "COLLECT_CATEGORY":
      if (!updatedProfile.gender) {
        updatedProfile.gender = entities.gender || "FEMALE";
      }
      nextStep = "EVALUATION_COMPLETE";
      break;

    case "EVALUATION_COMPLETE":
      if (entities.estimatedCost) updatedProfile.estimatedCost = entities.estimatedCost;
      if (entities.annualFamilyIncome) updatedProfile.annualFamilyIncome = entities.annualFamilyIncome;
      nextStep = "EVALUATION_COMPLETE";
      break;
  }

  // Ensure sensible defaults for completed profile
  const finalProfile: UserProfile = {
    annualFamilyIncome: updatedProfile.annualFamilyIncome ?? 240000,
    estimatedCost: updatedProfile.estimatedCost ?? 120000,
    gender: updatedProfile.gender ?? "FEMALE",
    targetGroup: updatedProfile.targetGroup,
    educationLevel: updatedProfile.educationLevel,
    projectCategory: updatedProfile.projectCategory ?? "General Small Business",
  };

  if (nextStep === "EVALUATION_COMPLETE") {
    const evaluationResult = evaluateEligibility(finalProfile);
    const completePrompt = DIALOG_PROMPTS[lang].EVALUATION_COMPLETE;

    return {
      nextState: {
        currentStep: "EVALUATION_COMPLETE",
        collectedProfile: finalProfile,
        language: lang,
        autoSpeak: currentState.autoSpeak,
      },
      assistantReply: completePrompt.promptText,
      newPrompts: completePrompt.quickPrompts,
      widgetData: {
        evaluationResult,
        userProfile: finalProfile,
      },
    };
  }

  const stepPromptData = DIALOG_PROMPTS[lang][nextStep];

  return {
    nextState: {
      currentStep: nextStep,
      collectedProfile: updatedProfile,
      language: lang,
      autoSpeak: currentState.autoSpeak,
    },
    assistantReply: stepPromptData.promptText,
    newPrompts: stepPromptData.quickPrompts,
  };
}
