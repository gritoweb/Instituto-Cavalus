import { getPayload, type Payload } from 'payload'
import config from './payload.config'

type CatSeed = {
  name: string
  slug: string
  icon?: string
  from: string
  to: string
}

const categories: CatSeed[] = [
  // Artigos
  { name: 'Manejo', slug: 'manejo', icon: 'landmark', from: '#314a2a', to: '#1a2f1d' },
  { name: 'Saúde Equina', slug: 'saude-equina', icon: 'stethoscope', from: '#456A54', to: '#243929' },
  { name: 'Treinamento', slug: 'treinamento', icon: 'target', from: '#3d5a3b', to: '#1c2e1e' },
  { name: 'Notícias', slug: 'noticias', from: '#2e4a35', to: '#152418' },
  { name: 'Eventos', slug: 'eventos', from: '#4a5e3a', to: '#22301c' },
  { name: 'Dicas', slug: 'dicas', from: '#5a6b3a', to: '#2e3a1e' },
  // Cursos
  { name: 'Doma', slug: 'doma', icon: 'star', from: '#314a2a', to: '#1a2f1d' },
  { name: 'Adestramento', slug: 'adestramento', icon: 'target', from: '#4a5e3a', to: '#22301c' },
  { name: 'Veterinária Equina', slug: 'veterinaria', icon: 'stethoscope', from: '#456A54', to: '#243929' },
  { name: 'Saúde & Nutrição', slug: 'saude-nutricao', icon: 'heart', from: '#456A54', to: '#1f3328' },
  { name: 'Reprodução', slug: 'reproducao', icon: 'sparkles', from: '#2e4a35', to: '#152418' },
  { name: 'Hipismo', slug: 'hipismo', icon: 'trophy', from: '#5a6b3a', to: '#2e3a1e' },
  { name: 'Negócios Equestres', slug: 'negocios', icon: 'briefcase', from: '#3d5a3b', to: '#1a2d1e' },
  { name: 'Emergência', slug: 'emergencia', from: '#456A54', to: '#243929' },
]

const articles = [
  { title: 'Como montar a rotina ideal de baia para o cavalo de esporte', excerpt: 'Os pequenos detalhes da rotina diária que mais impactam a saúde e o rendimento do cavalo no longo prazo.', cat: 'manejo', publishedAt: '2026-05-14', readingTime: 5 },
  { title: 'Sinais precoces de cólica: o que todo proprietário precisa observar', excerpt: 'Um guia direto para identificar os primeiros indícios de cólica e agir antes que o quadro se agrave.', cat: 'saude-equina', publishedAt: '2026-05-08', readingTime: 7 },
  { title: 'Doma racional vs. doma tradicional: quando cada uma faz sentido', excerpt: 'Um panorama honesto das duas abordagens, com critérios práticos para escolher o caminho certo para seu cavalo.', cat: 'treinamento', publishedAt: '2026-05-02', readingTime: 9 },
  { title: 'Escolhendo a sela certa: conforto para o cavalo e para o cavaleiro', excerpt: 'Como avaliar o ajuste da sela ao dorso, os materiais que duram mais e os erros que machucam o animal.', cat: 'dicas', publishedAt: '2026-04-28', readingTime: 4 },
  { title: 'Calendário equestre 2026: as principais provas do ano no Brasil', excerpt: 'Um apanhado das datas mais aguardadas do hipismo, da vaquejada e das exposições de criadores neste ano.', cat: 'noticias', publishedAt: '2026-04-22', readingTime: 3 },
  { title: 'Cobertura: o que rolou na maior feira de criadores do Sudeste', excerpt: 'Bastidores, leilões recordes e as tendências de manejo que dominaram as conversas entre os expositores.', cat: 'eventos', publishedAt: '2026-04-15', readingTime: 6 },
  { title: 'Vermifugação estratégica: por que o calendário fixo já era', excerpt: 'A abordagem moderna baseada em exame de fezes que reduz resistência parasitária e custo de manejo.', cat: 'saude-equina', publishedAt: '2026-04-09', readingTime: 6 },
  { title: 'Pastagem rotacionada: como dividir piquetes sem perder capim', excerpt: 'O passo a passo para planejar a rotação, dimensionar a lotação e manter o pasto produtivo o ano inteiro.', cat: 'manejo', publishedAt: '2026-04-03', readingTime: 8 },
  { title: 'A primeira fase do potro: o que fazer (e não fazer) no desbaste', excerpt: 'Como conduzir os primeiros contatos do potro com cabresto, sela e cavaleiro sem traumatizar o animal.', cat: 'treinamento', publishedAt: '2026-03-27', readingTime: 7 },
]

const courses = [
  { title: 'Doma Racional — Princípios do Manejo Calmo', description: 'Fundamentos do trabalho em redondel, leitura corporal do cavalo e técnicas de aproximação não-violenta.', cats: ['doma'], priceOld: 'R$ 397', priceNow: 'R$ 297', from: '#314a2a', to: '#1a2f1d', detail: true },
  { title: 'Primeiros Socorros para Cavalos no Campo', description: 'Avaliação de emergências, cólicas, ferimentos e manejo do cavalo até a chegada do veterinário.', cats: ['veterinaria', 'emergencia'], priceNow: 'R$ 449', from: '#456A54', to: '#243929' },
  { title: 'Manejo de Haras — Rotina, Pastagem e Bem-estar', description: 'Planejamento de baias, divisão de piquetes, rotações de pastagem e protocolos sanitários.', cats: ['manejo', 'negocios'], priceOld: 'R$ 497', priceNow: 'R$ 347', from: '#3a5a3a', to: '#1a2e1c' },
  { title: 'Adestramento Clássico — Bases para Competição', description: 'Passagens, transições, conexão e equilíbrio para cavaleiros que querem evoluir do treino ao concurso.', cats: ['hipismo'], priceNow: 'R$ 597', from: '#5a6b3a', to: '#2e3a1e' },
  { title: 'Reprodução Equina — Do Ciclo Estral ao Desmame', description: 'Manejo de matrizes, monta natural, inseminação artificial e cuidados nos primeiros meses do potro.', cats: ['reproducao'], priceNow: 'R$ 397', from: '#2e4a35', to: '#152418' },
  { title: 'Nutrição Equina Aplicada — Volumosos e Concentrados', description: 'Como montar uma dieta balanceada para cavalos de trabalho, esporte e descanso, sem desperdício.', cats: ['saude-nutricao'], priceOld: 'R$ 397', priceNow: 'R$ 297', from: '#456A54', to: '#1f3328' },
  { title: 'Gestão de Negócios Equestres — Do Pasto ao Lucro', description: 'Custos de manutenção, formação de preço, comercialização e canais de venda no mercado equestre.', cats: ['negocios'], priceNow: 'R$ 497', from: '#3d5a3b', to: '#1a2d1e' },
  { title: 'Equitação Western — Trabalho de Apartação e Rédea', description: 'Técnicas de rédea solta, comandos de pernas e o ritmo do cavalo de trabalho americano e brasileiro.', cats: ['adestramento', 'hipismo'], priceNow: 'R$ 547', from: '#4a5e3a', to: '#22301c' },
]

const instructors = [
  {
    key: 'joao-carvalho',
    name: 'João Carvalho',
    role: 'Domador e treinador de cavalos · 34 anos de campo',
    bio: 'Iniciou na lida com cavalos aos 12 anos, no interior do Rio Grande do Sul. Combina a escola americana de doma racional com o saber gaúcho de gerações. Já preparou mais de 800 cavalos e há 8 anos é instrutor-parceiro do Instituto Cavalus.',
  },
]

const lex = (paras: string[]) => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: paras.map((text) => ({
      type: 'paragraph',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      textFormat: 0,
      children: [{ type: 'text', text, format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
    })),
  },
})

const heroCards: {
  icon: 'award' | 'smartphone' | 'users'
  position: 'top' | 'mid' | 'bottom'
  title: string
  subtitle: string
}[] = [
  { icon: 'award', position: 'top', title: 'Certificado emitido', subtitle: 'Pelo Instituto Cavalus' },
  { icon: 'smartphone', position: 'mid', title: 'No seu ritmo', subtitle: 'Celular ou desktop' },
  { icon: 'users', position: 'bottom', title: 'Comunidade Cavalus', subtitle: '+5.000 alunos ativos' },
]

export const seed = async (payload: Payload) => {
  for (const collection of ['articles', 'courses', 'instructors', 'categories', 'pages'] as const) {
    await payload.delete({ collection, where: { id: { exists: true } } })
  }

  const instructorId: Record<string, number> = {}
  for (const i of instructors) {
    const doc = await payload.create({
      collection: 'instructors',
      data: { name: i.name, role: i.role, bio: i.bio },
    })
    instructorId[i.key] = doc.id as number
  }

  const catId: Record<string, number> = {}
  for (const c of categories) {
    const doc = await payload.create({
      collection: 'categories',
      data: { name: c.name, slug: c.slug, icon: c.icon as never, coverColorFrom: c.from, coverColorTo: c.to },
    })
    catId[c.slug] = doc.id as number
  }

  for (const a of articles) {
    await payload.create({
      collection: 'articles',
      data: {
        title: a.title,
        excerpt: a.excerpt,
        category: catId[a.cat],
        publishedAt: new Date(a.publishedAt).toISOString(),
        readingTime: a.readingTime,
        _status: 'published',
      },
    })
  }

  for (const co of courses) {
    const data: Record<string, unknown> = {
      title: co.title,
      description: co.description,
      categories: co.cats.map((s) => catId[s]),
      priceOld: (co as any).priceOld,
      priceNow: co.priceNow,
      coverColorFrom: co.from,
      coverColorTo: co.to,
      featured: true,
      _status: 'published',
    }

    if ((co as any).detail) {
      Object.assign(data, {
        lede: 'Aprenda os fundamentos do trabalho em redondel, a leitura corporal do cavalo e as técnicas de aproximação não-violenta com instrutores que vivem o ofício há décadas.',
        featuredCaption: 'Trabalho no redondel — primeiros minutos de contato com o cavalo',
        body: lex([
          'Domar é, antes de tudo, uma conversa. Antes de qualquer arreio, antes do primeiro passo de monta, existe a pergunta silenciosa que o cavalo faz: posso confiar em quem está aí? Este curso é sobre dar uma resposta honesta a essa pergunta.',
          'O Instituto Cavalus reuniu instrutores de doma racional com mais de 30 anos de campo para destrinchar, em 12 horas de conteúdo direto, as bases do que o mundo chama hoje de natural horsemanship — mas que cavaleiros do Brasil rural já praticavam há gerações.',
          'Aqui você não vai aprender truques. Vai aprender a ler o cavalo — orelhas, narinas, olhos, postura — e a oferecer, em troca, uma presença previsível e calma.',
        ]),
        whatYouLearn: [
          { strong: 'Leitura corporal do cavalo:', text: 'entender, em tempo real, o que ele está sentindo só pela posição das orelhas, da cabeça e dos cascos.' },
          { strong: 'Trabalho em redondel:', text: 'protocolo completo de aproximação, desensibilização, comando à distância e construção de confiança nos primeiros 7 dias.' },
          { strong: 'Ferramentas certas:', text: 'quando usar cabresto, cabo, palmatória de plástico e quando não usar nada.' },
          { strong: 'Primeira monta:', text: 'como preparar o cavalo para receber peso pela primeira vez sem trauma.' },
          { strong: 'Solução de problemas:', text: 'o que fazer quando o cavalo recua, empaca, dá patada ou se mostra defensivo.' },
          { strong: 'Bem-estar e descanso:', text: 'sinais de que o cavalo está cansado mentalmente, e por que parar a sessão na hora certa acelera o aprendizado.' },
        ],
        forWho: [
          { strong: 'Proprietários e tratadores', text: 'que querem entender melhor o cavalo que já têm em casa, mesmo que nunca tenham domado.' },
          { strong: 'Cavaleiros iniciantes', text: 'que estão em contato com cavalos jovens e querem partir do pé certo, sem vícios.' },
          { strong: 'Profissionais do campo', text: 'que aprenderam a doma "no dia a dia" e querem sistematizar o que já fazem por instinto.' },
          { strong: 'Veterinários e zootecnistas', text: 'que precisam manejar cavalos arredios em procedimentos clínicos.' },
        ],
        modules: [
          { title: 'Princípios da doma racional', description: 'A diferença entre doma agressiva e racional. Pressão e alívio.', duration: '1h20' },
          { title: 'Linguagem corporal do cavalo', description: 'Mapa completo: orelhas, olhos, narinas, cauda, postura, peso nos cascos.', duration: '1h45' },
          { title: 'Preparando o redondel', description: 'Tamanho ideal, piso, materiais, segurança do cavaleiro.', duration: '45min' },
          { title: 'Primeira sessão — aproximação', description: 'Como entrar no redondel, posicionamento, primeiros 15 minutos.', duration: '2h00' },
          { title: 'Sessões 2 a 7 — construindo confiança', description: 'Progressão dia a dia, marcos a observar, quando avançar e quando recuar.', duration: '2h30' },
          { title: 'Desensibilização ao toque', description: 'Acostumando o cavalo à mão, à manta, ao selim.', duration: '1h15' },
          { title: 'A primeira monta', description: 'Preparação completa do cavalo para receber peso.', duration: '1h35' },
          { title: 'Resolvendo problemas comuns', description: 'Cavalo que recua, empaca, dá patada, morde.', duration: '50min' },
        ],
        bonus: {
          title: 'Bônus exclusivo do Instituto Cavalus',
          text: 'Ao concluir o curso, você recebe acesso ao grupo privado de alunos, com sessão ao vivo mensal de tira-dúvidas com os instrutores e uma biblioteca contínua de casos reais.',
        },
        quote: {
          text: 'Cavalo bom não se faz à força. Se faz com tempo, com paciência, e com a humildade de admitir que quem tem mais a aprender, no redondel, é sempre o homem.',
          cite: 'Mestre João Carvalho, instrutor-chefe do curso',
        },
        instructors: [instructorId['joao-carvalho']],
        priceInstallment: '12× de R$ 29,75',
        details: [
          { title: 'Carga horária', sub: '12 horas de conteúdo em vídeo' },
          { title: '8 módulos', sub: 'Da teoria à primeira monta' },
          { title: 'Certificado de conclusão', sub: 'Emitido pelo Instituto Cavalus' },
          { title: 'Acesso por 12 meses', sub: 'Assista no seu ritmo' },
          { title: 'Sessão ao vivo mensal', sub: 'Tira-dúvidas com instrutores' },
          { title: 'Suporte direto', sub: 'Resposta em até 1 dia útil' },
          { title: 'Material de apoio', sub: 'PDFs, checklists e diários' },
          { title: 'Garantia de 7 dias', sub: 'Reembolso integral, sem perguntas' },
        ],
        ctaLabel: 'Fazer matrícula',
        ctaUrl: '#',
      })
    }

    await payload.create({ collection: 'courses', data: data as never })
  }

  // Globals
  await payload.updateGlobal({
    slug: 'header',
    data: {
      navItems: [
        { label: 'Home', href: '/' },
        { label: 'Cursos', href: '/cursos' },
        { label: 'Artigos', href: '/artigos' },
        { label: 'Contato', href: '/#contato' },
      ],
      cta: { label: 'Ver cursos', href: '/cursos' },
    },
  })

  await payload.updateGlobal({
    slug: 'footer',
    data: {
      description:
        'Vitrine de cursos do universo equestre brasileiro, do Instituto Cavalus — ligado ao Portal Cavalus, a maior comunidade equestre do país.',
      navTitle: 'Navegação',
      navLinks: [
        { label: 'Home', href: '/' },
        { label: 'Cursos', href: '/cursos' },
        { label: 'Artigos', href: '/artigos' },
        { label: 'Contato', href: '/#contato' },
        { label: 'Política de Privacidade', href: '#' },
        { label: 'Termos de Uso', href: '#' },
      ],
      contact: { email: 'contato@institutocavalus.com.br', phone: '(XX) XXXX-XXXX', location: 'Cidade/UF' },
      socials: [
        { platform: 'instagram', href: '#' },
        { platform: 'youtube', href: '#' },
        { platform: 'facebook', href: '#' },
      ],
      copyright: '© 2026 Instituto Cavalus. Todos os direitos reservados.',
      note: 'Parte do Portal Cavalus',
    },
  })

  // HOME
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Home',
      slug: 'home',
      _status: 'published',
      layout: [
        {
          blockType: 'heroEditorial',
          eyebrow: 'Instituto Cavalus — desde 2014',
          headlineBefore: 'Cursos do universo equestre, com',
          headlineEmphasis: 'quem entende',
          headlineAfter: 'de cavalo.',
          lede: 'Capacitação prática e teórica em manejo, doma, hipismo, veterinária e gestão equestre — assinada pelo Instituto Cavalus.',
          actions: [
            { label: 'Explorar cursos', href: '/cursos', variant: 'primary' },
            { label: 'Conheça o Instituto', href: '/#contato', variant: 'ghost' },
          ],
          showArt: true,
          floatingCards: heroCards,
        },
        {
          blockType: 'statsStrip',
          items: [
            { prefix: '+', value: '10', caption: 'Anos de Cavalus' },
            { prefix: '+', value: '50', caption: 'Cursos disponíveis' },
            { prefix: '+', value: '5.000', caption: 'Alunos capacitados' },
            { prefix: '+', value: '30', caption: 'Instrutores parceiros' },
          ],
        },
        {
          blockType: 'featureGrid',
          eyebrow: 'Diferenciais',
          title: 'Por que estudar no Instituto Cavalus?',
          lede: 'Um programa pensado por gente do campo, para quem vive (ou quer viver) o universo equestre brasileiro.',
          features: [
            { icon: 'book', title: 'Conteúdo prático', description: 'Currículo desenhado por profissionais com vivência de campo.' },
            { icon: 'users', title: 'Comunidade Cavalus', description: 'Conexão direta com o maior portal equestre do Brasil.' },
            { icon: 'smartphone', title: 'Acesso flexível', description: 'Estude no seu ritmo, do celular ou computador.' },
            { icon: 'award', title: 'Certificado reconhecido', description: 'Conclua e receba certificado do Instituto Cavalus.' },
          ],
        },
        { blockType: 'featuredCourses', eyebrow: 'Catálogo', title: 'Cursos em destaque', linkLabel: 'Ver todos', linkHref: '/cursos', source: 'featured', limit: 8, alt: true },
        { blockType: 'categoriesExplore', eyebrow: 'Áreas de estudo', title: 'Explore por área', linkBase: '/cursos' },
        { blockType: 'latestArticles', eyebrow: 'Conhecimento equestre', title: 'Do nosso blog', linkLabel: 'Ver todos', linkHref: '/artigos', limit: 3 },
        {
          blockType: 'faq',
          eyebrow: 'Tire suas dúvidas',
          title: 'Perguntas frequentes',
          items: [
            { question: 'O Instituto Cavalus emite certificado?', answer: 'Sim. Ao concluir qualquer curso, você recebe um certificado digital emitido em nome do Instituto, com carga horária e conteúdo programático.', open: true },
            { question: 'Os cursos têm prazo para conclusão?', answer: 'Você tem 12 meses de acesso a partir da matrícula para concluir cada curso, no seu ritmo.' },
            { question: 'Como funciona o pagamento?', answer: 'O pagamento é processado direto na plataforma de venda parceira, via cartão de crédito, Pix e boleto.' },
            { question: 'Posso parcelar?', answer: 'Sim, o parcelamento no cartão de crédito está disponível em até 12 vezes, com condições que variam por curso.' },
            { question: 'Há suporte durante o curso?', answer: 'Cada curso oferece um canal de dúvidas com o instrutor ou a equipe pedagógica, com retorno em até 1 dia útil.' },
            { question: 'Preciso ter experiência prévia com cavalos?', answer: 'Depende do curso. Há cursos introdutórios e há cursos avançados — sempre indicado na descrição.' },
          ],
        },
        {
          blockType: 'ctaBand',
          eyebrow: 'Hora de começar',
          title: 'Pronto para começar?',
          text: 'Conheça o catálogo completo do Instituto Cavalus e leve sua jornada no universo equestre a outro nível.',
          actions: [
            { label: 'Explorar cursos', href: '/cursos', variant: 'white' },
            { label: 'Falar com a equipe', href: '/#contato', variant: 'outline-white' },
          ],
        },
      ],
    },
  })

  // CURSOS
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Cursos',
      slug: 'cursos',
      _status: 'published',
      layout: [
        {
          blockType: 'heroEditorial',
          eyebrow: 'Catálogo de cursos',
          headlineBefore: 'Cursos do universo equestre, com',
          headlineEmphasis: 'quem entende',
          headlineAfter: 'de cavalo.',
          lede: 'Capacitação prática e teórica em manejo, doma, hipismo, veterinária e gestão equestre — assinada pelo Instituto Cavalus.',
          showArt: true,
          floatingCards: heroCards,
        },
        { blockType: 'coursesCatalog', label: 'Filtros', searchPlaceholder: 'Buscar curso por nome ou tema…', coursesLimit: 100 },
      ],
    },
  })

  // ARTIGOS
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Artigos',
      slug: 'artigos',
      _status: 'published',
      layout: [
        {
          blockType: 'heroEditorial',
          eyebrow: 'Blog do Instituto Cavalus',
          headlineBefore: 'Conhecimento equestre, direto de',
          headlineEmphasis: 'quem vive',
          headlineAfter: 'o campo.',
          lede: 'Artigos práticos sobre manejo, saúde, treinamento e o dia a dia do universo equestre — escritos por especialistas do Instituto Cavalus.',
          showArt: true,
          floatingCards: [
            { icon: 'book', position: 'top', title: 'Novos artigos', subtitle: 'Toda semana' },
            { icon: 'users', position: 'mid', title: 'Por especialistas', subtitle: 'Gente do campo' },
            { icon: 'share-2', position: 'bottom', title: 'Conteúdo aberto', subtitle: 'Gratuito para ler' },
          ] as {
            icon: 'book' | 'users' | 'share-2'
            position: 'top' | 'mid' | 'bottom'
            title: string
            subtitle: string
          }[],
        },
        { blockType: 'articlesArchive', label: 'Filtros', searchPlaceholder: 'Buscar artigos por título ou tema…', articlesLimit: 12 },
      ],
    },
  })

  payload.logger.info('Seed concluído com sucesso.')
}

// Execução via `payload run src/seed.ts`
if (process.argv[1]?.includes('seed')) {
  ;(async () => {
    const payload = await getPayload({ config: await config })
    await seed(payload)
    process.exit(0)
  })().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
