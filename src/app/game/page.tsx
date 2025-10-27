"use client"

import React, {useEffect, useRef, useState} from "react";
import dog from "./image/enemy_chihuahua.png";
import cat from "./image/player_siam.png";
import bar from "./image/enemy_health_bar.png";
import weapon from "./image/weapon_cat_straw_1.png";
import field from "./image/map_field_day.png";
import CButton from "@/app/common/ui/CButton";
import "./Animation.css";

export default function GamePage() {

    interface Monster {
        name: string,
        currHP: number,
        fullHP: number,
        state: string,
    }

    const player = {
        name:"Cat",
        ATK: 30,
        Lvl: 1,
        money:0,
    }

    const testMonster: Monster = {
        name: "Dog",
        currHP: 100,
        fullHP: 100,
        state:"alive",
    }

    const [monster, setMonster] = useState<Monster>(testMonster)
    const [msgList, setMsgList] = useState<string[]>([])
    const [isMonsterSpawned, setIsMonsterSpawned] = useState(false);
    const [isAttacking, setIsAttacking] = useState(false);
    const [isMonsterHit, setIsMonsterHit] = useState(false);
    const msgEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [msgList]);

    const monsterElement = () => {
        return (
            <div className={"relative top-20 left-180 w-fit h-fit p-2"}>

                <div className={"w-full text-center"}>{monster.name}</div>

                <div className={" w-40 h-10 border rounded-xl mb-3"}>
                    <img src={bar.src}
                         alt={'health bar'}
                        className={`w-full h-full`}/>
                    <div className={`bg-red-600 w-calc(${(monster.currHP/monster.fullHP)*100}%) h-full mt-[-38]`}>
                        {monster.currHP}/{monster.fullHP}
                    </div>
                </div>

                <div
                    className={`flex flex-col-reverse`}
                    onClick={() => {
                        attack()
                    }}
                >
                    <img src={dog.src}
                         alt={'enemy'}
                         className={`scale-x-[-1] w-40 h-40
                         ${monster.state === 'dead' ? 'dust' : 'monster_breathing'} ${isMonsterHit ? 'monster_hit' : ''}`}/>

                </div>
            </div>
        )
    }

    const addMsg = (newmsg: string) => {
        setMsgList(prev => [...prev, newmsg]);
    }

    const attack = () => {
        if (monster.currHP <= 0) return;
        if (isAttacking) return;

        setIsAttacking(true);
        setTimeout(() => {
            setIsAttacking(false);
        }, 300);

        setIsMonsterHit(true);
        setTimeout(() => {
            setIsMonsterHit(false);
        }, 300);

        const newHp = monster.currHP - player.ATK;
        setMonster({...monster, currHP: newHp > 0 ? newHp : 0});
        addMsg(`${monster.name} damaged -${player.ATK}`);

        if (newHp <= 0) {
            defeatMonster()
        }
    }

    const spawnMonster = () => {
        addMsg(`A wild ${testMonster.name} appeared!`);
        setMonster(testMonster);
        setIsMonsterSpawned(true);
    }

    useEffect(() => {
        spawnMonster();
    }, []);


    const defeatMonster = () => {
        setMonster({...monster,currHP: 0, state:"dead"});
        addMsg(`${monster.name} is defeated!`);
        setTimeout(() => {
            setIsMonsterSpawned(false);
            spawnMonster()
        }, 1000*0.5);
    }

    return (
        <div className={"flex justify-center"}>
            <div className={"border aspect-video overflow-hidden w-[70%] relative select-none"}
                 style={{backgroundImage: `url(${field.src})`, backgroundSize: 'cover'}}
            >

                <CButton onClick={spawnMonster}>spawn monster</CButton>

                {isMonsterSpawned && monsterElement()}

                <div
                    className={`absolute left-30 bottom-0 w-fit`}>
                    <img src={cat.src}
                         alt={'enemy'}
                         className={`w-full h-full player_breathing`}/>
                    <img src={weapon.src} alt={'weapon'}
                         className={`pointer-events-none absolute w-100 h-100 rotate-30 top-[150] right-[-150] ${isAttacking ? 'player_attack' : ''}`}
                    />
                </div>


                <div className={"absolute w-40 h-fit bottom-5 left-170 flex flex-col justify-center items-start space-y-2 border-2 rounded-2xl bg-white p-2"}>
                    <div>
                        {player.name}
                    </div>
                    <div>
                        ATK: {player.ATK}
                    </div>
                    <div>
                        Lvl: {player.Lvl}
                    </div>
                    <div>
                        GOLD: {player.money}
                    </div>
                </div>

                <div className={"border absolute w-50 h-full right-0 top-0 overflow-y-auto select-auto bg-white"}>
                    {msgList.map((msg, index) => {
                        return <div key={index}>{msg}</div>
                    })}
                    <div ref={msgEndRef} />
                </div>

            </div>


        </div>
    )
}