import { NextRequest, NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from "google-auth-library";

// 구글 문서를 불러오는 함수
async function loadGoogleDoc(){
  try{
    const key = process.env.REACT_APP_GOOGLE_PRIVATE_KEY;
    const serviceAccountAuth = new JWT({
      key: key,
      email: process.env.REACT_APP_GOOGLE_API_EMAIL,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const doc = new GoogleSpreadsheet(
      process.env.REACT_APP_GOOGLE_SHEETS_ID || "",
      serviceAccountAuth
    );
    await doc.loadInfo();
    return doc;
  } catch (error) {
    console.log(error);
  }
}

export async function POST(
  req: NextRequest,
){
  try{
    // 구글 문서를 불러옴
    const doc = await loadGoogleDoc();
    if(!doc){
      return NextResponse.json({error: "Internal Server Error(load Doc)"}, {status: 500});
    }

    // sheet1이 있는지 확인하고, 없다면 생성
    let sheet = doc.sheetsByTitle["sheet1"];
    if(!sheet){
        console.log('Create a new sheet');
        sheet = await doc.addSheet({
            headerValues: ["이름", "내용1", "내용2", "내용3", "내용4", "내용5"],
            title: "sheet1",
        });
    }

    // NextRequest로부터 데이터를 가져옴
    const body = req.body;
    if (!body) {
        console.log('Body is null');
        return NextResponse.json({erorr: "Bad Request"},{status: 400});
    };

    // 데이터를 텍스트로 변환
    const processText = async () => {
        const reader = body.getReader();
        let result = '';
        let done, value;
      
        while ({ done, value } = await reader.read(), !done) {
          result += new TextDecoder("utf-8").decode(value);
        }
      
        return result;
      };
    // 텍스트를 정리하고 json형식으로 변환
    const result = await processText();
    const cleanedBody = result.replace(/\\/g, '').slice(11, -2); 
    const jsonData = JSON.parse(cleanedBody);

    // 변환한 json형식대로 sheet에 추가
    await sheet.addRow({
        이름: jsonData.name,
        지역: jsonData.region,
        시간: new Date().toLocaleString(),
    });
    return NextResponse.json({success: true}, {status: 200});
  } catch(error){
    return NextResponse.json({error: "Internal Server Error(import Data)"}, {status: 500});
  }
}

export async function GET(
    req: NextRequest,
){
    try{
        const query = req.nextUrl.searchParams.get('query') as string;
        console.log(query);

        const doc = await loadGoogleDoc();
        if(!doc){
            return NextResponse.json({error: "Internal Server Error(load Doc)"}, {status: 500});
        }
        let sheet = doc.sheetsByTitle["sheet1"];
        if(!sheet){
            console.log('Create a new sheet');
            sheet = await doc.addSheet({
                headerValues: ["이름", "내용1", "내용2", "내용3", "내용4", "내용5"],
                title: "sheet1",
            });
        }

        const rows = await sheet.getRows();
        const regexQuery = new RegExp(query.replace('*', '.*'));

        const matchingRows = rows.filter((row) => regexQuery.test(row.get("이름")));
        const data = matchingRows.map((row) => {
          return {
            이름: row.get("이름"),
            내용1: row.get("내용1"),
            내용2: row.get("내용2"),
            내용3: row.get("내용3"),
            내용4: row.get("내용4"),
            내용5: row.get("내용5"),
          };
        });

        return NextResponse.json({success: true, data: data}, {status: 200});
    } catch(error){
        return NextResponse.json({error: "Internal Server Error(get Sheets)"}, {status: 500});
    }
}