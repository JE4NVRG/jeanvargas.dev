"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";

import { useState } from "react";
import { ProjetoGaleria } from "@/data/projects";

interface ProjectCardProps {
  projeto: ProjetoGaleria;
  index: number;
  onClick: () => void;
}

export const ProjectCard = ({ projeto, index, onClick }: ProjectCardProps) => {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
      }}
      viewport={{ once: true, margin: "-100px" }}
      className="group relative cursor-pointer hover:cursor-pointer"
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 p-1 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50 transition-colors duration-300">
        {/* Efeito de brilho no hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />

        <div className="relative overflow-hidden rounded-xl bg-gray-900/80 backdrop-blur-sm">
          {/* Container da imagem */}
          <div className="relative h-48 overflow-hidden rounded-t-xl">
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.4 }}
              className="relative h-full w-full"
            >
              {!imageError ? (
                <Image
                  src={projeto.imagem}
                  alt={`Preview do projeto ${projeto.nome}`}
                  fill
                  className="object-cover transition-transform duration-500"
                  onError={() => setImageError(true)}
                  priority={index < 3}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                  <div className="text-center">
                    <Github className="mx-auto h-12 w-12 text-gray-500 mb-2" />
                    <p className="text-sm text-gray-400">
                      Preview indisponível
                    </p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Overlay gradiente */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
          </div>

          {/* Conteúdo do card */}
          <div className="relative p-6 space-y-4">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                {projeto.nome}
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
                {projeto.descricao}
              </p>
            </div>

            {/* Tecnologias */}
            <div className="flex flex-wrap gap-2">
              {projeto.tecnologias.map((tech, techIndex) => (
                <motion.span
                  key={tech.nome}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * techIndex }}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${tech.cor} border border-current/20 backdrop-blur-sm`}
                >
                  {tech.nome}
                </motion.span>
              ))}
            </div>

            {/* Categoria badge */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-lg text-xs font-medium bg-gray-700/50 text-gray-300 border border-gray-600/50">
                {projeto.categoria.toUpperCase()}
              </span>

              {/* Indicador de clique */}
              <div className="flex items-center gap-2 text-blue-400 text-sm font-medium">
                <span>Ver detalhes</span>
                <ExternalLink className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
