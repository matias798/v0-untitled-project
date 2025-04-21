import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { word: string } }) {
  try {
    const word = params.word

    if (!word) {
      return NextResponse.json({ error: "Se requiere una palabra" }, { status: 400 })
    }

    // En una implementación real, aquí se generaría o se obtendría el audio
    // Por ahora, simplemente devolvemos un mensaje informativo

    return NextResponse.json({
      message: "API de TTS simulada",
      word,
      audioUrl: `/audio/${word}.mp3`, // URL simulada
    })
  } catch (error: any) {
    return NextResponse.json({ error: `Error al generar audio: ${error.message}` }, { status: 500 })
  }
}
