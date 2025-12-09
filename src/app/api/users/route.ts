import { NextResponse } from 'next/server';
import { getUsersFacade } from '@/modules/user/facade';

export async function GET() {
  const users = await getUsersFacade();
  return NextResponse.json(users);
}
