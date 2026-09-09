import {
  isLensRecommendationInput,
  type LensRecommendationResponse,
} from "@/lib/lens/types";
import { getLensRecommendation } from "@/lib/server/lens-recommendation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let input: unknown;

  try {
    input = await request.json();
  } catch {
    return invalidInputResponse();
  }

  if (!isLensRecommendationInput(input)) {
    return invalidInputResponse();
  }

  try {
    const result = await getLensRecommendation(input);
    return Response.json(result);
  } catch (error) {
    console.error("Failed to get a LENS recommendation.", error);

    const body: LensRecommendationResponse = {
      recommendation: null,
      reason: "INTERNAL_ERROR",
    };
    return Response.json(body, { status: 500 });
  }
}

function invalidInputResponse() {
  const body: LensRecommendationResponse = {
    recommendation: null,
    reason: "INVALID_INPUT",
  };
  return Response.json(body, { status: 400 });
}
