'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-context-menu";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate } from "@/utils/functions/formatDate";
import { attendantTime } from "@/utils/functions/attendantTime";
import { truncateText } from "@/utils/functions/truncateText";
import { chamado } from "@prisma/client";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function ChamadosAbertos() {
    const [chamados, setChamados] = useState<chamado[]>([]);
    const [selectedProblem, setSelectedProblem] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    // Função para buscar os dados dos chamados
    useEffect(() => {
        const fetchChamados = async () => {
            try {
                const response = await fetch("/api/chamados_finalizados", {
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
            const matchesSearchTerm = chamado.requester.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        chamado.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        chamado.description.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesProblem && matchesUser && matchesSearchTerm;
        })
        .sort((a, b) => {
            const dateA = a.finishedAt ? new Date(a.finishedAt).getTime() : 0;
            const dateB = b.finishedAt ? new Date(b.finishedAt).getTime() : 0;
            return dateB - dateA; // Ordena do mais recente para o mais antigo
        });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredChamados.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredChamados.length / itemsPerPage);

    function numberTicketOnPage(pageNumber: number, indexNumber: number) {
        return pageNumber >= 2 ? `${(pageNumber - 1) * itemsPerPage + indexNumber + 1}` : `${indexNumber + 1}`;
    }


    return (
        <div className="p-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex justify-between">
                        Chamados Finalizados
                        <div className="flex">
                            <Input 
                                type="text" 
                                className="max-w-[500px] rounded-r-none ring-0 focus-visible:ring-offset-0 focus-visible:ring-0" 
                                placeholder="Pesquisar..." 
                                value={searchTerm} // Valor do input de busca
                                onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o estado do termo de busca
                            />
                            <Button variant="outline" className="rounded-l-none border-l-0">
                                <Search />
                            </Button>
                        </div>


                    </CardTitle>
                    <CardDescription>Lista de chamados finalizados</CardDescription>
                </CardHeader>
                <Separator />
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="pl-4">Nº</TableHead>
                                <TableHead className="pl-4">Requisitante</TableHead>
                                <TableHead className="pl-4">Assunto</TableHead>
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
                                            <SelectValue placeholder="Responsável:" />
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
                                <TableHead>
                                    <Select onValueChange={(value) => setSelectedUser(value)}>
                                        <SelectTrigger className="w-[180px] h-8">
                                            <SelectValue placeholder="Finalizado por:" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Finalizado por:</SelectLabel>
                                                <SelectItem value="João Paulo">João Paulo</SelectItem>
                                                <SelectItem value="Jhionathan Badias">Jhionathan Badias</SelectItem>
                                                <SelectItem value="Felipe Campos">Felipe Campos</SelectItem>
                                                <SelectItem value="Christofer Almeida">Christofer Almeida</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </TableHead>
                                <TableHead className="pl-4">Data da Criação 🟢</TableHead>
                                <TableHead className="pl-4">Tempo de Atendimento 🟡</TableHead>
                                <TableHead className="pl-4">Data de Encerramento 🔴</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentItems.length > 0 ? (
                                currentItems.map((chamado, index) => (
                                    <Dialog key={chamado.id}>
                                        <DialogTrigger className="hover:cursor-pointer" asChild>
                                            <TableRow key={chamado.id}>
                                                <TableCell className="font-medium text-center">{numberTicketOnPage(currentPage, index)}º</TableCell>
                                                <TableCell className="pl-4 w-32">{chamado.requester}</TableCell>
                                                <TableCell className="pl-4 truncate w-48 overflow-hidden text-ellipsis whitespace-nowrap">{truncateText(chamado.subtitle, 15)}</TableCell>
                                                <TableCell className="pl-4 w-56">{chamado.typeproblem}</TableCell>
                                                <TableCell className="pl-4 truncate w-48 overflow-hidden text-ellipsis whitespace-nowrap">{truncateText(chamado.description, 20)}</TableCell>
                                                <TableCell className="pl-4">{chamado.attributedByUser}</TableCell>
                                                <TableCell className="pl-4">{chamado.finishedByUser}</TableCell>
                                                <TableCell className="pl-4 w-56">{formatDate(chamado.createdAt)}</TableCell>
                                                <TableCell className="pl-4 w-56">{attendantTime(chamado.attributedAt as Date, chamado.finishedAt as Date)}</TableCell>
                                                <TableCell className="pl-4 w-56">{formatDate(chamado.finishedAt as Date)}</TableCell>
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
                                                        <TableRow className="w-full">
                                                            <TableCell>
                                                                <span>
                                                                    <strong>Motivo: </strong> {chamado.reasonFinished}
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
                                    <TableCell colSpan={10} className="text-center">Nenhum chamado encontrado.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter >
                        </TableFooter>
                    </Table>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious href="#" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} />
                            </PaginationItem>
                            {[...Array(totalPages)].map((_, i) => (
                                <PaginationItem key={i}>
                                    <PaginationLink href="#" onClick={() => setCurrentPage(i + 1)}>{i + 1}</PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext href="#" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </CardContent>
            </Card>
        </div>
    );
}
