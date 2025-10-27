"use client"

import CButton from "@/app/common/ui/CButton";
import axios from "axios";

export default function FunctionTest() {

    const naverExchangeRate = ()=>{
        console.log("naverExchangeRate")
        const params = {
            key:"calculator",//몰겠음
            pkid:141,//몰겠음
            q:"%ED%99%98%EC%9C%A8&",//몰겠음
            where:"m",//몰겠음
            u1:"keb",//몰겠음
            u2:1,//원환율 액
            u3:"USD",//시작 단위
            u4:"KRW",//종료 단위
            u6:"standardUnit",//몰겠음
            u7:0,//몰겠음
            u8:"down",//몰겠음
        };

        const url:string = "https://m.search.naver.com/p/csearch/content/qapirender.nhn";

        axios.get(url, { params: params })
            .then(response => {
                console.log(response.data);
                console.log(response.data.country)
                const origin = response.data.country[0]
                const target = response.data.country[1]
            })
            .catch(error => {
                console.error(error);
            });

    }

    return (
        <div>
            <h1>마이데이터 API(카드 이용내역 조회용도)</h1>
            <CButton>TEST</CButton>

            <h1>네이버 환율조회 api</h1>
            <CButton onClick={()=> {
                naverExchangeRate()
            }}>TEST</CButton>
        </div>
    )
}