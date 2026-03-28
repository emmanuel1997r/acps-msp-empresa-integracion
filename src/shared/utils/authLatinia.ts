export async function obtenerToken() {
  console.log("Obteniendo Token");
  const tokenUrl = process.env.LATINIA_TOKEN_URL;
  const grantType = process.env.GRANT_TYPE ?? "";
  const scope = process.env.SCOPE;
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;

  console.log("Vaiables de entorno: ", tokenUrl, " Scope ", scope);
  if (!tokenUrl || !scope || !clientId || !clientSecret) {
    throw new Error("Variables de entorno requeridas no definidas");
  }

  const body = new URLSearchParams({
    grant_type: grantType,
    scope: scope,
    client_id: clientId,
    client_secret: clientSecret,
  });

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    console.log("Error al generar el token");
    throw new Error(`Error token: ${error}`);
  }

  const data: any = await response.json();
  const token: string = data.access_token;

  const maskedToken =
    token && token.length > 10
      ? `${token.slice(0, 5)}...${token.slice(-5)}`
      : token;

  console.log("Token Obtenido: ", maskedToken);
  return data.access_token;
}
 