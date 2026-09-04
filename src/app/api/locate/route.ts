import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // 1. Check Vercel native edge geolocation headers
    const vercelLat = req.headers.get("x-vercel-ip-latitude");
    const vercelLng = req.headers.get("x-vercel-ip-longitude");
    const vercelCity = req.headers.get("x-vercel-ip-city");
    const vercelRegion = req.headers.get("x-vercel-ip-country-region");

    if (vercelLat && vercelLng) {
      const lat = parseFloat(vercelLat);
      const lng = parseFloat(vercelLng);
      if (!isNaN(lat) && !isNaN(lng)) {
        return NextResponse.json({
          success: true,
          lat,
          lng,
          city: vercelCity ? decodeURIComponent(vercelCity) : undefined,
          region: vercelRegion ? decodeURIComponent(vercelRegion) : undefined,
          source: "vercel-edge",
        });
      }
    }

    // 2. Fallback to public IP geolocation service (for local development or custom hosting)
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";

    const ipQuery = clientIp && clientIp !== "::1" && clientIp !== "127.0.0.1" ? clientIp : "";

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    try {
      const res = await fetch(`https://ipwho.is/${ipQuery}`, {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.success !== false && data.latitude && data.longitude) {
          return NextResponse.json({
            success: true,
            lat: data.latitude,
            lng: data.longitude,
            city: data.city || undefined,
            region: data.region || undefined,
            source: "ip-lookup",
          });
        }
      }
    } catch {
      // Primary fallback failed, try secondary
    }

    // Secondary fallback service
    try {
      const secController = new AbortController();
      const secTimeoutId = setTimeout(() => secController.abort(), 3000);

      const secRes = await fetch("https://freeipapi.com/api/json", {
        signal: secController.signal,
        headers: { Accept: "application/json" },
      });
      clearTimeout(secTimeoutId);

      if (secRes.ok) {
        const secData = await secRes.json();
        if (secData && secData.latitude && secData.longitude) {
          return NextResponse.json({
            success: true,
            lat: secData.latitude,
            lng: secData.longitude,
            city: secData.cityName || undefined,
            region: secData.regionName || undefined,
            source: "secondary-ip-lookup",
          });
        }
      }
    } catch {
      // Ignore secondary error
    }

    return NextResponse.json(
      {
        success: false,
        error: "Unable to detect IP location automatically",
      },
      { status: 404 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Internal server error during location resolution",
      },
      { status: 500 }
    );
  }
}
