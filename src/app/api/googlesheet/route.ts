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
        return NextResponse.json({error: "Bad Request"},{status: 400});
    };
    const bodyData = await new Response(body).text();

    console.log(bodyData + ' body on routepost');
    // json형식으로 변환
    const jsonbody = JSON.parse(bodyData);

    if(jsonbody.이름 === '') return NextResponse.json({success: false},{status: 400});

    // 변환한 json형식대로 sheet에 추가
    await sheet.addRow({
        이름: jsonbody.이름,
        내용1: jsonbody.내용1,
        내용2: jsonbody.내용2,
        내용3: jsonbody.내용3,
        내용4: jsonbody.내용4,
        내용5: jsonbody.내용5,
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
        if (!query) {
          return NextResponse.json({success: true, data: null}, {status: 200});;
        }else{
        
        const regexQuery = new RegExp(`^${query.replace('*', '.*')}$`);
        
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

        return NextResponse.json({success: true, data: data}, {status: 200});}
    } catch(error){
        return NextResponse.json({error: "Internal Server Error(get Sheets)"}, {status: 500});
    }
}

export async function PUT(
    req: NextRequest,
    ){
    try{
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

        const body = req.body;
        if (!body) {
            console.log('Body is null');
            return NextResponse.json({error: "Bad Request"},{status: 400});
        };
        const bodyData = await new Response(body).text();
        const input = JSON.parse(bodyData);
        const updateadata = input.inputData;
        const origindata = input.jsonmodalData;

        const rows = await sheet.getRows(); 
        for (let i = 0; i < rows.length; i++) {
            if (rows[i].get("이름") === origindata.이름 &&
            rows[i].get("내용1") === origindata.내용1 &&
            rows[i].get("내용2") === origindata.내용2 &&
            rows[i].get("내용3") === origindata.내용3 &&
            rows[i].get("내용4") === origindata.내용4 &&
            rows[i].get("내용5") === origindata.내용5
            ) {
              await rows[i].delete();
              break;
            }
          }

          const newRow = await sheet.addRow({
            이름: updateadata.이름,
            내용1: updateadata.내용1,
            내용2: updateadata.내용2,
            내용3: updateadata.내용3,
            내용4: updateadata.내용4,
            내용5: updateadata.내용5
          });
          newRow.save();

        return NextResponse.json({success: true}, {status: 200});
    } catch(error){
        return NextResponse.json({error: "Internal Server Error(put Sheets)"}, {status: 500});
    }
}

export async function DELETE(
    req: NextRequest,
    ){
    try{
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

        const body = req.body;
        if (!body) {
            console.log('Body is null');
            return NextResponse.json({error: "Bad Request"},{status: 400});
        };
        const bodyData = await new Response(body).text();
        const input = JSON.parse(bodyData);

        const rows = await sheet.getRows(); 
        for (let i = 0; i < rows.length; i++) {
            if (
                rows[i].get("이름") === input.이름 &&
                rows[i].get("내용1") === input.내용1 &&
                rows[i].get("내용2") === input.내용2 &&
                rows[i].get("내용3") === input.내용3 &&
                rows[i].get("내용4") === input.내용4 &&
                rows[i].get("내용5") === input.내용5
                ) {
              await rows[i].delete();
              break;
            }
          }

        return NextResponse.json({success: true}, {status: 200});
    } catch(error){
        return NextResponse.json({error: "Internal Server Error(delete Sheets)"}, {status: 500});
    }
}
