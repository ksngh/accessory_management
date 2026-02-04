import { NextResponse } from 'next/server';

const metadata = {
  colors: ["골드", "로즈", "실버"],
  ringSizes: ["3호","5호","7호","9호","11호","13호","15호","17호","19호","21호","23호"],
  orderStatuses: ["대기", "완료"],
  categories: [
    { id: '1', name: '반지', count: 0, icon: '' },
    { id: '2', name: '목걸이', count: 0, icon: '' },
    { id: '3', name: '귀걸이', count: 0, icon: '' },
  ]
};

export async function GET() {
  return NextResponse.json(metadata);
}
