"use client";

import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function CheckSignin() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      // 세션이 없으면 로그인 페이지로 이동
      signIn();
    } else if (session.user) {
      // 세션이 있으면 /sheet 페이지로 이동
      router.push(`${process.env.NEXTAUTH_URL}/sheet`);
    }
  }, [session, router]);

  // 로딩 컴포넌트 또는 null 반환
  return null;
}

export default CheckSignin;
