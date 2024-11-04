import { PrismaClient } from "@prisma/client";
import { Button } from "@/components/ui/button"
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