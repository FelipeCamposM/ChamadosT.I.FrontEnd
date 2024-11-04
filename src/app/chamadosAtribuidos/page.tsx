'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-context-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { chamado } from "@prisma/client"
import { useEffect, useState } from "react"
import { formatDate } from "@/utils/functions/formatDate";
import { attendantTime } from "@/utils/functions/attendantTime";

export default function ChamadosAbertos() {

    const [chamados, setChamados] = useState<chamado[]>([]);
    const [selectedProblem, setSelectedProblem] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);

      // Função para buscar os dados dos chamados
      useEffect(() => {
        const fetchChamados = async () => {
            try {
            const response = await fetch("/api/chamados_atribuidos", {
                method: "GET",
            });
            if (!response.ok) {
                throw new Error("Erro ao buscar os chamados.");
            }
            const data = await response.json();
            setChamados(data); // Atualiza o estado com os chamados
            } catch (error) {
            console.error("Erro ao buscar os chamados:", error);
            }
        };

        fetchChamados();
        }, []);

        // Filtra os chamados com base nas seleções
    const filteredChamados = chamados
    .filter((chamado) => {
        const matchesProblem = selectedProblem ? chamado.typeproblem === selectedProblem : true;
        const matchesUser = selectedUser ? chamado.attributedByUser === selectedUser : true;
        return matchesProblem && matchesUser;
    })
    .sort((a, b) => {
        // Verifica se finishedAt não é null antes de fazer a comparação
        const dateA = a.attributedAt ? new Date(a.attributedAt).getTime() : 0;
        const dateB = b.attributedAt ? new Date(b.attributedAt).getTime() : 0;
        
        return dateB - dateA; // Ordena do mais recente para o mais antigo
    });

    const getNowTime = new Date();

    return (
        <>
        <div className="p-4">
            <Card> 
                <CardHeader>
                    <CardTitle>Chamados Atribuidos</CardTitle>
                    <CardDescription>Lista de Chamados Atribuidos</CardDescription>
                </CardHeader>
                <Separator/>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="pl-4">Nº</TableHead>
                                <TableHead className="pl-4">Requisitante</TableHead>
                                <TableHead className="pl-4">Assunto</TableHead>
                                <TableHead className="pl-4">Email</TableHead>
                                <TableHead>
                                    <Select onValueChange={(value) => setSelectedProblem(value)}>
                                        <SelectTrigger className="w-[180px] h-8">
                                            <SelectValue placeholder="Tipo de Problema" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                            <SelectLabel>Problemas</SelectLabel>
                                            <SelectItem value="Winthor">Winthor 🟠</SelectItem>
                                            <SelectItem value="Ellevti">Ellévti 🔵</SelectItem>
                                            <SelectItem value="Whatsapp">Whatsapp 🟢</SelectItem>
                                            <SelectItem value="Cadastro-Usuario">Cadastro de Usuários 👤</SelectItem>
                                            <SelectItem value="Problema-Equipamentos">Problema com Equipamentos 🛠️</SelectItem>
                                            <SelectItem value="Problema-Impressoras">Problema com Impressoras 🖨️</SelectItem>
                                            <SelectItem value="Problema-Site">Problema com o Site 🌐</SelectItem>
                                            <SelectItem value="Instalacao-Software">Instalação de Software 💾</SelectItem>
                                            <SelectItem value="Requisicao-Equipamento">Requisição de equipamento 🛠️</SelectItem>
                                            <SelectItem value="Ajuda-TI">Obter Ajuda T.I. 💻</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </TableHead>
                                <TableHead className="pl-4">Descrição</TableHead>
                                <TableHead>
                                    <Select onValueChange={(value) => setSelectedUser(value)}>
                                        <SelectTrigger className="w-[180px] h-8">
                                            <SelectValue placeholder="Responsável" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Responsáveis</SelectLabel>
                                                <SelectItem value="João Paulo">João Paulo</SelectItem>
                                                <SelectItem value="Jhionathan Badias">Jhionathan Badias</SelectItem>
                                                <SelectItem value="Felipe Campos">Felipe Campos</SelectItem>
                                                <SelectItem value="Christofer Almeida">Christofer Almeida</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </TableHead>
                                <TableHead className="pl-4">Data da Criação 🟢</TableHead>
                                <TableHead className="pl-4">Tempo de Aberto 🟡</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredChamados.length > 0 ? (
                                filteredChamados
                                    .map((chamado: chamado) => (
                                    <Dialog key={chamado.id}>
                                        <DialogTrigger className="hover:cursor-pointer" asChild>
                                            <TableRow key={chamado.id}>
                                                <TableCell className="font-medium text-center">{(chamados.indexOf(chamado) + 1 + "º").toString()}</TableCell>
                                                <TableCell className="pl-4 w-32">{chamado.requester}</TableCell>
                                                <TableCell className="pl-4">{chamado.subtitle}</TableCell>
                                                <TableCell className="pl-4">{chamado.email}</TableCell>
                                                <TableCell className="pl-4 w-56">{chamado.typeproblem}</TableCell>
                                                <TableCell className="pl-4">{chamado.description}</TableCell>
                                                <TableCell className="pl-4">{chamado.attributedByUser}</TableCell>
                                                <TableCell className="pl-4 w-56">{formatDate(chamado.createdAt)}</TableCell>
                                                <TableCell className="pl-4 w-56">{attendantTime(chamado.createdAt, getNowTime as Date)}</TableCell>
                                            </TableRow>
                                            </DialogTrigger>
                                                <DialogContent className="w-2/3 h-1/2">
                                                <DialogHeader>
                                                    <DialogTitle className="flex">
                                                        <span>
                                                            Informações à respeito do Chamado
                                                        </span>
                                                    </DialogTitle>
                                                </DialogHeader>
                                                    <Table className="flex flex-col w-full">
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead className="w-screen">Informações</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell className="w-screen">
                                                                <span className="w-full">
                                                                    <strong>Nome do Solicitante: </strong> {chamado.requester}
                                                                </span>
                                                                </TableCell>
                                                            </TableRow>                                                                
                                                            <TableRow className="w-full">
                                                                <TableCell>
                                                                    <span>
                                                                        <strong>Assunto: </strong> {chamado.subtitle}
                                                                    </span>
                                                                </TableCell>
                                                            </TableRow>                                                                
                                                            <TableRow className="w-full">
                                                                <TableCell>
                                                                    <span>
                                                                        <strong>Descrição: </strong> {chamado.description}
                                                                    </span>
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow className="w-full">
                                                                <TableCell>
                                                                    <span>
                                                                        <strong>Tipo de Problema: </strong> {chamado.typeproblem}
                                                                    </span>
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow className="w-full">
                                                                <TableCell>
                                                                    <span>
                                                                        <strong>Responsável: </strong> {chamado.attributedByUser}
                                                                    </span>
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow className="w-full">
                                                                <TableCell>
                                                                    <span>
                                                                        <strong>Motivo de Encerramento: </strong> {chamado.reasonFinished}
                                                                    </span>
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                            </DialogContent>
                                    </Dialog>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center">Nenhum chamado encontrado.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
        </>
    );
}