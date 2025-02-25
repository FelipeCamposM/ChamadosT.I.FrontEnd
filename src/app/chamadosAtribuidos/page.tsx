'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-context-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { chamado } from "@prisma/client"
import { useEffect, useState } from "react"
import { formatDate } from "@/utils/functions/formatDate";
import { attendantTime } from "@/utils/functions/attendantTime";
import { truncateText } from "@/utils/functions/truncateText";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eraser } from "lucide-react";


export default function ChamadosAbertos() {

    const [chamados, setChamados] = useState<chamado[]>([]);
    const [selectedProblem, setSelectedProblem] = useState<string | null>(null);
    const [selectedUserEnded, setSelectedUserEnded] = useState<string | null>(null);
    const [selectedUserAttributed, setSelectedUserAttributed] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("")
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    const isWithinDateRange = (date: string | number | Date) => {
        const calledDate = new Date(date);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        return (!start || calledDate >= start) && (!end || calledDate <= end);
    };

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

    // Função para limpar todos os filtros
    const clearFilters = () => {
        setSelectedProblem(null);
        setSelectedUserAttributed(null);
        setSelectedUserEnded(null);
        setSearchTerm("");
        setStartDate("");
        setEndDate("");
        // setCurrentPage(1);
    };

        // Filtra os chamados com base nas seleções
    const filteredChamados = chamados
    .filter((chamado) => {
        const matchesProblem = selectedProblem ? chamado.typeproblem === selectedProblem : true;
        const matchesUserAttributed = selectedUserAttributed ? chamado.attributedByUser === selectedUserAttributed : true;
        const matchesUserEnded = selectedUserEnded ? chamado.finishedByUser === selectedUserEnded : true;
        const matchesSearchTerm = chamado.requester.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    chamado.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    chamado.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDate = isWithinDateRange(chamado.createdAt);
        return matchesProblem && matchesUserAttributed && matchesUserEnded && matchesSearchTerm && matchesDate;
    })
    .sort((a, b) => {
        // Verifica se finishedAt não é null antes de fazer a comparação
        const dateA = a.attributedAt ? new Date(a.attributedAt).getTime() : 0;
        const dateB = b.attributedAt ? new Date(b.attributedAt).getTime() : 0;
        
        return dateB - dateA; // Ordena do mais recente para o mais antigo
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredChamados.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredChamados.length / itemsPerPage);
    const startPage = Math.max(1, currentPage - 7); // Começa 7 páginas antes do número atual
    const endPage = Math.min(totalPages, startPage + 14); // Termina 15 páginas após o início

    function numberTicketOnPage(pageNumber: number, indexNumber: number) {
        return pageNumber >= 2 ? `${(pageNumber - 1) * itemsPerPage + indexNumber + 1}` : `${indexNumber + 1}`;
    }

    return (
        <>
        <div className="p-4">
            <Card className="my-10 mx-5 bg-[#fcfcfc]"> 
                <CardHeader>
                    <CardTitle className="flex justify-between">
                        <span>Chamados Atribuidos</span>
                        <div className="flex space-x-2">
                            <div className="flex gap-2">
                                <Button className="mt-6" variant="outline" onClick={clearFilters}>Limpar <Eraser className="w-4 h-4"/></Button>
                                <div className="flex flex-col gap-2">
                                    <span className="pl-2 font-normal">Data Início</span>
                                    <Input
                                        type="date"
                                        className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0 font-normal cursor-pointer"
                                        placeholder="Data de Início"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="pl-2 font-normal">Data Finalizado</span>
                                    <Input
                                        type="date"
                                        className="ring-0 focus-visible:ring-offset-0 focus-visible:ring-0 font-normal cursor-pointer"
                                        placeholder="Data de Fim"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>
                            </div>
                            <Input 
                                type="text" 
                                className="mt-6 max-w-[500px] ring-0 focus-visible:ring-offset-0 focus-visible:ring-0" 
                                placeholder="Pesquisar..." 
                                value={searchTerm} // Valor do input de busca
                                onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o estado do termo de busca
                            />
                        </div>
                    </CardTitle>
                </CardHeader>
                <Separator/>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-white">
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
                                            <SelectItem value="none">Sem Filtro ▼</SelectItem>
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
                                <TableHead>
                                    <Select onValueChange={(value) => setSelectedUserAttributed(value)}>
                                        <SelectTrigger className="h-8 lg:w-[110px] xl:w-[180px] lg:text-xs xl:text-sm">
                                            <SelectValue placeholder="Responsável" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                            <SelectLabel>Responsáveis</SelectLabel>
                                                <SelectItem value="☕João Paulo 💻">☕João Paulo 💻</SelectItem>
                                                <SelectItem value="Jhionathan R3">Jhionathan R3</SelectItem>
                                                <SelectItem value="Felipe Campos">Felipe Campos</SelectItem>
                                                <SelectItem value="Christofer">Christofer</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </TableHead>
                                <TableHead className="pl-4 lg:text-xs xl:text-sm">Data da Criação 🟢</TableHead>
                                <TableHead className="pl-4 lg:text-xs xl:text-sm">Tempo de Aberto 🟡</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredChamados.length > 0 ? (
                                filteredChamados
                                    .map((chamado: chamado, index) => (
                                    <Dialog key={chamado.id}>
                                        <DialogTrigger className="hover:cursor-pointer" asChild>
                                            <TableRow key={chamado.id} className="max-h-16 h-16">
                                                <TableCell className="font-medium text-center lg:text-xs xl:text-sm">{numberTicketOnPage(currentPage, index)}</TableCell>
                                                <TableCell className="pl-4 w-32 lg:text-xs xl:text-sm">{chamado.requester}</TableCell>
                                                <TableCell className="pl-4 truncate w-48 overflow-hidden text-ellipsis whitespace-nowrap lg:text-xs xl:text-sm">{truncateText(chamado.subtitle, 15)}</TableCell>
                                                <TableCell className="pl-4 lg:text-xs xl:text-sm">{chamado.email}</TableCell>
                                                <TableCell className="pl-4 w-56 lg:text-xs xl:text-sm">{chamado.typeproblem}</TableCell>
                                                <TableCell className="pl-4 truncate w-48 overflow-hidden text-ellipsis whitespace-nowrap lg:text-xs xl:text-sm">{truncateText(chamado.description, 20)}</TableCell>
                                                <TableCell className="pl-4 lg:text-xs xl:text-sm">{chamado.attributedByUser}</TableCell>
                                                <TableCell className="pl-4 w-56 lg:text-xs xl:text-sm">{formatDate(chamado.createdAt)}</TableCell>
                                                <TableCell className="pl-4 w-56 lg:text-xs xl:text-sm">{attendantTime(chamado.createdAt, new Date() as Date)}</TableCell>
                                            </TableRow>
                                            </DialogTrigger>
                                                <DialogContent className="w-2/3 h-[650px]">
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
                                                            <TableRow className="w-full h-16">
                                                                <TableCell className="w-screen">
                                                                <span className="w-full">
                                                                    <strong>Nome do Solicitante: </strong> {chamado.requester}
                                                                </span>
                                                                </TableCell>
                                                            </TableRow>                                                                
                                                            <TableRow className="w-full h-16">
                                                                <TableCell>
                                                                    <span>
                                                                        <strong>Assunto: </strong> {chamado.subtitle}
                                                                    </span>
                                                                </TableCell>
                                                            </TableRow>                                                                
                                                            <TableRow className="w-full h-16">
                                                                <TableCell>
                                                                    <span>
                                                                        <strong>Descrição: </strong> {chamado.description}
                                                                    </span>
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow className="w-full h-16">
                                                                <TableCell>
                                                                    <span>
                                                                        <strong>Tipo de Problema: </strong> {chamado.typeproblem}
                                                                    </span>
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow className="w-full h-16">
                                                                <TableCell>
                                                                    <span>
                                                                        <strong>Responsável: </strong> {chamado.attributedByUser}
                                                                    </span>
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow className="w-full h-16">
                                                                <TableCell>
                                                                    <span>
                                                                        <strong>Data da Criação 🟢: </strong> {formatDate(chamado.createdAt)}
                                                                    </span>
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow className="w-full h-16">
                                                                <TableCell>
                                                                    <span>
                                                                        <strong>Tempo de Aberto 🟡: </strong> {attendantTime(chamado.createdAt, new Date() as Date)}
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
                                    <TableCell colSpan={9} className="text-center">Nenhum chamado encontrado.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious href="#" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} />
                            </PaginationItem>
                            {[...Array(endPage - startPage + 1)].map((_, i) => (
                                <PaginationItem key={i + startPage}>
                                    <PaginationLink className={currentPage === i + startPage ? "bg-gray-200" : ""} href="#" onClick={() => setCurrentPage(i + startPage)}>{i + startPage}</PaginationLink>
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
        </>
    );
}