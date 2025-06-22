"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ProjectCard } from "./project-card";
import { projetosGaleria, type ProjetoGaleria } from "@/data/projects";

type Categoria = "Todos" | "Full Stack" | "Mobile" | "IA & Bot" | "Backend";

export const ProjectGallery = () => {
  const [categoriaAtiva, setCategoriaAtiva] = useState<Categoria>("Todos");

  const categorias: Categoria[] = [
    "Todos",
    "Full Stack",
    "Mobile",
    "IA & Bot",
    "Backend",
  ];

  // Mapear categorias do frontend para as do backend
  const mapearCategoria = (categoria: Categoria): string => {
    switch (categoria) {
      case "Full Stack":
        return "fullstack";
      case "Mobile":
        return "mobile";
      case "IA & Bot":
        return "ia";
      case "Backend":
        return "backend";
      default:
        return "";
    }
  };

  const projetosFiltrados =
    categoriaAtiva === "Todos"
      ? projetosGaleria
      : projetosGaleria.filter(
          (projeto) => projeto.categoria === mapearCategoria(categoriaAtiva)
        );

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Galeria de Projetos
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Veja alguns projetos que desenvolvi com foco em performance, design
            e tecnologia de ponta
          </p>
        </motion.div>

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categorias.map((categoria) => (
            <button
              key={categoria}
              onClick={() => setCategoriaAtiva(categoria)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                categoriaAtiva === categoria
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              style={{ cursor: "pointer" }}
            >
              {categoria}
            </button>
          ))}
        </motion.div>

        {/* Grid de Projetos */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projetosFiltrados.map((projeto: ProjetoGaleria, index: number) => (
            <motion.div
              key={projeto.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                layout: { duration: 0.3 },
              }}
            >
              <ProjectCard
                projeto={projeto}
                index={index}
                onClick={() => {
                  // Abrir GitHub direto em nova aba
                  window.open(projeto.link, "_blank", "noopener,noreferrer");
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Rodapé da seção */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-gray-400 text-lg">
            ✨ <strong>{projetosFiltrados.length}</strong> projeto
            {projetosFiltrados.length !== 1 ? "s" : ""}{" "}
            {categoriaAtiva !== "Todos" ? `em ${categoriaAtiva}` : "no total"}
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Clique em qualquer card para ver o repositório no GitHub
          </p>
        </motion.div>
      </div>
    </section>
  );
};
