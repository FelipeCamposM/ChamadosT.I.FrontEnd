import { PrismaClient } from "@prisma/client";
import { Button } from "@/components/ui/button";
import next from "next";
import Link from "next/link";
import Image from "next/image";

const prisma = new PrismaClient();

export default async function Header() {
    return (
        <div className="flex justify-between w-full h-20 p-4 bg-neutral-900">
        <div className="flex gap-4 items-center">
            <Link href="/">
            <Button className="hover:bg-neutral-800">Chamados Abertos</Button>
            </Link>
            <Link href="/chamadosAtribuidos">
            <Button className="hover:bg-neutral-800">Chamados Atribuidos</Button>
            </Link>
            <Link href="chamadosFinalizados">
            <Button className="hover:bg-neutral-800">Chamados Finalizados</Button>
            </Link>
        </div>

        {/* <input type="checkbox" value="" className="sr-only peer" onClick={toggleToDarkMode}/>
        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gray-600 dark:peer-checked:bg-gray-600"></div> */}

        <div className="pr-8 items-center">
            <Image
            src="/LOGO R3 BRANCA.png"
            alt="Logo"
            width={50}
            height={50}
            className="end-0"
            />
        </div>
        </div>
    );
}
