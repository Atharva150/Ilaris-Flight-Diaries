import axios, { type AxiosError } from "axios";
import type { DiaryEntry, NewDiaryEntry } from "../types";

const baseUrl = "https://ilaris-flight-diaries.onrender.com/api/diaries";

const getAll = async (): Promise<DiaryEntry[]> => {
  const response = await axios.get<DiaryEntry[]>(baseUrl);
  return response.data;
};

const getAxiosErrorMessage = (error: unknown): string => {
  const axiosError = error as AxiosError<unknown>;

  const data = axiosError.response?.data;
  // Common backend shapes we might send
  if (typeof data === "string") return data;
  if (data && typeof data === "object") {
    const maybe = data as { message?: unknown; error?: unknown };
    if (typeof maybe.message === "string") return maybe.message;
    if (typeof maybe.error === "string") return maybe.error;
    if (Array.isArray((data as { error?: unknown }).error)) {
      // zod issues array
      return JSON.stringify((data as { error: unknown }).error);
    }
  }

  return axiosError.message || "Request failed";
};

const create = async (object: NewDiaryEntry): Promise<DiaryEntry> => {
  try {
    const response = await axios.post<DiaryEntry>(baseUrl, object);
    return response.data;
  } catch (error: unknown) {
    const message = getAxiosErrorMessage(error);
    throw new Error(message, { cause: error });
  }

};

export default {
  getAll,
  create,
};



