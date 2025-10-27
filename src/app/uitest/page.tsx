"use client"
import React, {useState} from "react";
import CButton from "@/app/common/ui/CButton";
import CInput from "@/app/common/ui/CInput";
import CRadio,{RadioOption} from "@/app/common/ui/CRadio";
import CSelect,{SelectOption} from "@/app/common/ui/CSelect";
import CTextarea from "@/app/common/ui/CTextarea";
import Modal from "@/app/common/components/Modal";
import CSection from "@/app/common/ui/CSection1";
import CSection1 from "@/app/common/ui/CSection2";
import CInputCurrency from "@/app/common/ui/CInputCurrency";
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import DragDropTest from "@/app/uitest/DragDropTest";
import LongPressExample from "@/app/uitest/LongPressExample";


export default function Uidemo() {


    const testRadioOptions:RadioOption[] = [{value:"1",label:"1"},{value:"2",label:"2"},{value:"3",label:"3"},]

    const [testRadioValue,setTestRadioValue] = useState<string>("1")

    const testSelectOptions:SelectOption[] = [{value:"1",label:"1"},{value:"2",label:"2"},{value:"3",label:"3"},]

    const [testSelectValue,setTestSelectValue] = useState<string>("1")

    const [testInputValue,setTestInputValue] = useState<string>("")

    const [testTextAreaValue,setTestTextAreaValue] = useState<string>("")

    const [testModalIsOpen,setTestModalIsOpen] = useState<boolean>(false)

    const [testInputCurrencyValue,setTestInputCurrencyValue] = useState<number>(0)

    const sortTestItems = ["1","2","3"]

  return (
      <div className={"select-none p-10 pb-20"}>

          <div>
              <h1>modal</h1>
              <CButton onClick={()=>{setTestModalIsOpen(true)}}>modalTest</CButton>
              <Modal
                  size={"sm"}
                title={"modalTest"}
                isOpen={testModalIsOpen}
                onClose={()=>{setTestModalIsOpen(false)}}>
                  children
              </Modal>
          </div>

          <div>
              <h1>button</h1>
              <CButton size={"sm"} variant={"primary"}>button</CButton>

              <CButton size={"md"} variant={"secondary"}>button</CButton>

              <CButton size={"lg"} variant={"danger"}>button</CButton>

          </div>


          <div>
              <h1>input</h1>
              <CInput size={"sm"} type={"text"} value={testInputValue} onChange={(value)=>{setTestInputValue(value)}}/>

              <CInput size={"md"} type={"number"} value={testInputValue} onChange={(value)=>{setTestInputValue(value)}}/>

              <CInput size={"lg"} type={"password"} value={testInputValue} onChange={(value)=>{setTestInputValue(value)}}/>


          </div>

          <div>
              <h1>radio</h1>
              <CRadio
                  direction={"horizontal"}
                  name={"radio1"}
                  options={testRadioOptions}
                  value={testRadioValue}
                  onChange={(value:string)=>{
                      setTestRadioValue(value)
                  }}
              />

              <CRadio
                  direction={"vertical"}
                  name={"radio2"}
                  options={testRadioOptions}
                  value={testRadioValue}
                  onChange={(value:string)=>{
                      setTestRadioValue(value)
                  }}
              />
          </div>

          <div>
              <h1>select</h1>

              <CSelect
                  size={"sm"}
                  options={testSelectOptions}
                  value={testSelectValue}
                  onChange={(value:string)=>{setTestSelectValue(value)}}
              />

              <CSelect
                  size={"md"}
                  options={testSelectOptions}
                  value={testSelectValue}
                  onChange={(value:string)=>{setTestSelectValue(value)}}
              />

              <CSelect
                  size={"lg"}
                  options={testSelectOptions}
                  value={testSelectValue}
                  onChange={(value:string)=>{setTestSelectValue(value)}}
              />

          </div>

          <div>
              <h1>textarea</h1>
              <CTextarea
                size={"sm"}
                value={testTextAreaValue}
                onChange={(value:string)=>{setTestTextAreaValue(value)}}/>
              <CTextarea
                size={"md"}
                value={testTextAreaValue}
                onChange={(value:string)=>{setTestTextAreaValue(value)}}/>
              <CTextarea
                size={"lg"}
                resize={false}
                value={testTextAreaValue}
                onChange={(value:string)=>{setTestTextAreaValue(value)}}/>
          </div>
          <div>
              <h1>section</h1>
              <CSection1>
                  <h2>section1</h2>
                  <div>section1-1</div>
                  <div>section1-2</div>
              </CSection1>
              <CSection>
                  <h2>section2</h2>
                  <div>section2-1</div>
                  <div>section2-2</div>
              </CSection>
          </div>
          <div>
              <h1>inputCurrency</h1>
              <CInputCurrency
                onChange={(value:number)=> {
                    setTestInputCurrencyValue(value)
                }}
                value={testInputCurrencyValue}
                selectOnFocus={true}
              />

              <div>
                  {testInputCurrencyValue}
              </div>
          </div>
          <div>
              <h1>modal</h1>
              <CButton onClick={()=>{setTestModalIsOpen(true)}}>modalTest</CButton>
              <Modal
                  size={"sm"}
                title={"modalTest"}
                isOpen={testModalIsOpen}
                onClose={()=>{setTestModalIsOpen(false)}}>
                  children
              </Modal>
          </div>
          <div>
              <h1>Drag and Drop</h1>
              <DragDropTest />
          </div>
          <div>
              <h1>Long Press</h1>
              <LongPressExample/>
          </div>
      </div>
  );
}