"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ExternalLink, Globe, Server, Smartphone } from "lucide-react";

export default function Home() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden text-white bg-gradient-to-br from-gray-900 via-black to-gray-800 min-h-screen">
        <div className="relative container mx-auto px-6 py-24 sm:py-32 z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-6xl font-bold tracking-wide text-center leading-tight mb-6">
              {t("hero.name")}
            </h1>

            <h2 className="text-2xl sm:text-3xl mb-6 text-blue-200 font-semibold">
              {t("hero.title")}
            </h2>

            <div className="text-lg sm:text-xl mb-8 text-gray-200 leading-relaxed max-w-4xl mx-auto">
              <p className="mb-4">{t("hero.description")}</p>
              <p>{t("hero.contact")}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://wa.me/5511948477047?text=Olá Jean! Vi seu portfólio e gostaria de conversar sobre uma oportunidade."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200"
              >
                {t("hero.whatsapp")}
              </a>

              <a
                href="#servicos"
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold py-4 px-8 rounded-lg hover:bg-white/20 transition-all duration-200"
              >
                {t("hero.viewServices")}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Seção de Projetos */}
      <section id="projetos" className="py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Projetos em Destaque
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Conheça alguns dos meus trabalhos mais recentes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "MepChat",
                desc: "Plataforma WhatsApp com chatbot",
                tech: ["Node.js", "Firebase"],
              },
              {
                title: "PetConnect",
                desc: "Plataforma adoção de pets",
                tech: ["Flutter", "Supabase"],
              },
              {
                title: "Criptopto",
                desc: "Bot trading com IA",
                tech: ["Node.js", "OpenAI"],
              },
            ].map((project, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg"
              >
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {project.desc}
                </p>
                <div className="flex gap-2 mb-4">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <a
                  href="#"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                  Ver Projeto <ExternalLink size={16} className="ml-1" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção de Serviços */}
      <section id="servicos" className="py-20 px-6 bg-gray-900 text-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Serviços</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Soluções completas em desenvolvimento.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Sites & Landing Pages", icon: Globe },
              { title: "Plataformas SaaS", icon: Server },
              { title: "Apps Mobile", icon: Smartphone },
            ].map((service, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-6">
                <service.icon className="text-blue-400 mb-4" size={32} />
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-300 mb-4">
                  Descrição do serviço {service.title.toLowerCase()}.
                </p>
                <a
                  href={`https://wa.me/5511948477047?text=Olá Jean! Quero saber mais sobre ${service.title}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
                >
                  Saiba Mais
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">
            © 2025 Jean Carlos Vargas. Portfolio desenvolvido com Next.js.
          </p>
        </div>
      </footer>
    </div>
  );
}
