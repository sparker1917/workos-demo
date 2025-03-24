export const POST = async (req: Request) => {
  const body = await req.formData()
  const lookupKey = body.get('lookup_key')

  return Response.json({ message: 'success', body: { lookupKey } })
}
