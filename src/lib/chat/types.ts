import { UserProfile, EvaluationResult } from "@/lib/schemes/types";

export type MessageSender = "USER" | "ASSISTANT" | "SYSTEM";

export type MessageType = "TEXT" | "SCHEME_WIDGET" | "ERROR";

export interface QuickPrompt {
  id: string;
  label: string;
  value: string;
  iconName?: string;
}

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  timestamp: string;
  type: MessageType;
  widgetData?: {
    evaluationResult?: EvaluationResult;
    userProfile?: Partial<UserProfile>;
  };
  isAudioPlaying?: boolean;
}

export type AssistantLanguage = "en-IN" | "hi-IN" | string;

export type DialogStep =
  | "GREETING"
  | "COLLECT_ACTIVITY"
  | "COLLECT_COST"
  | "COLLECT_INCOME"
  | "COLLECT_CATEGORY"
  | "EVALUATION_COMPLETE";

export interface DialogState {
  currentStep: DialogStep;
  collectedProfile: Partial<UserProfile>;
  language: AssistantLanguage;
  autoSpeak: boolean;
}
