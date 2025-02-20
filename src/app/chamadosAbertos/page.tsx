'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-context-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { chamado } from "@prisma/client"
import { useEffect, useState } from "react"
import { formatDate } from "@/utils/functions/formatDate";



export default function ChamadosAbertos() {

    const [chamados, setChamados] = useState<chamado[]>([]);
    const [selectedProblem, setSelectedProblem] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("")
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

      // Função para buscar os dados dos chamados
      useEffect(() => {
        const fetchChamados = async () => {
            try {
            const response = await fetch("/api/chamados_abertos", {
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
        return matchesProblem;
    })
    .sort((a, b) => {
        // Verifica se finishedAt não é null antes de fazer a comparação
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        
        return dateB - dateA; // Ordena do mais recente para o mais antigo
    });

    function numberTicketOnPage(pageNumber: number, indexNumber: number) {
        return pageNumber >= 2 ? `${(pageNumber - 1) * itemsPerPage + indexNumber + 1}` : `${indexNumber + 1}`;
    }

    return (
        <>
        <div className="p-4">
            <Card> 
                <CardHeader>
                    <CardTitle>Chamados Abertos</CardTitle>
                    <CardDescription>Lista de Chamados Abertos</CardDescription>
                </CardHeader>
                <Separator/>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="pl-4 lg:text-xs xl:text-sm">Nº</TableHead>
                                <TableHead className="pl-4 lg:text-xs xl:text-sm">Requisitante</TableHead>
                                <TableHead className="pl-4 lg:text-xs xl:text-sm">Assunto</TableHead>
                                <TableHead className="pl-4 lg:text-xs xl:text-sm">Email</TableHead>
                                <TableHead>
                                    <Select onValueChange={(value) => setSelectedProblem(value)}>
                                        <SelectTrigger className="h-8 lg:w-[140px] xl:w-[180px] lg:text-xs xl:text-sm">
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
                                <TableHead className="pl-4 lg:text-xs xl:text-sm">Descrição</TableHead>
                                <TableHead className="pl-4 lg:text-xs xl:text-sm">Data da Criação 🟢</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredChamados.length > 0 ? (
                                filteredChamados
                                    .map((chamado: chamado, index) => (
                                    <Dialog key={chamado.id}>
                                        <DialogTrigger className="hover:cursor-pointer" asChild>
                                            <TableRow key={chamado.id}>
                                                <TableCell className="font-medium text-center lg:text-xs xl:text-sm">{numberTicketOnPage(currentPage, index)}</TableCell>
                                                <TableCell className="pl-4 w-32 lg:text-xs xl:text-sm">{chamado.requester}</TableCell>
                                                <TableCell className="pl-4 lg:text-xs xl:text-sm">{chamado.subtitle}</TableCell>
                                                <TableCell className="pl-4 lg:text-xs xl:text-sm">{chamado.email}</TableCell>
                                                <TableCell className="pl-4 w-56 lg:text-xs xl:text-sm">{chamado.typeproblem}</TableCell>
                                                <TableCell className="pl-4 lg:text-xs xl:text-sm">{chamado.description}</TableCell>
                                                <TableCell className="pl-4 w-56 lg:text-xs xl:text-sm">{formatDate(chamado.createdAt)}</TableCell>
                                                
                                            </TableRow>
                                            </DialogTrigger>
                                            <DialogContent className="w-2/3 h-1/3">
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
                                                        </TableBody>
                                                    </Table>
                                            </DialogContent>
                                    </Dialog>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center lg:text-xs xl:text-sm">Nenhum chamado encontrado.</TableCell>
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