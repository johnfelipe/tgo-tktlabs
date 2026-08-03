import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader, FileText, Info, Search, HelpCircle, Zap, Type, Layers } from 'lucide-react';
import { KnowledgeBaseApiService, type SearchResultDoc } from '@/services/knowledgeBaseApi';
import { useToast } from '@/hooks/useToast';
import { useAuthStore } from '@/stores/authStore';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';


interface SearchTestProps {
    collectionId: string;
}

type SearchMode = 'hybrid' | 'embedding' | 'fulltext';

type ContentType = 'qa_pair' | 'paragraph' | 'heading' | 'table' | 'list' | 'code';

const CONTENT_TYPES: {
    value: ContentType;
    name: string;
    description: string;
}[] = [
        { value: 'qa_pair', name: 'QA Preguntas y Respuestas', description: 'Datos de preguntas y respuestas de la base de conocimiento QA' },
        { value: 'paragraph', name: 'Párrafo del documento', description: 'Párrafos en el documento' },
        { value: 'heading', name: 'Título', description: 'Títulos de sección en el documento' },
        { value: 'table', name: 'Tabla', description: 'Contenido de tablas en el documento' },
        { value: 'list', name: 'Lista', description: 'Elementos de lista en el documento' },
        { value: 'code', name: 'Bloque de código', description: 'Fragmentos de código en el documento' },
    ];

const SEARCH_MODES: {
    value: SearchMode;
    name: string;
    description: string;
    icon: React.ReactNode;
}[] = [
        {
            value: 'hybrid',
            name: 'Búsqueda híbrida',
            description: 'Combina comprensión semántica y coincidencia de palabras clave, recomendado para usar',
            icon: <Layers className="w-4 h-4" />
        },
        {
            value: 'embedding',
            name: 'Búsqueda semántica',
            description: 'Basado en similitud vectorial, comprende el significado semántico',
            icon: <Zap className="w-4 h-4" />
        },
        {
            value: 'fulltext',
            name: 'Búsqueda de texto completo',
            description: 'Búsqueda precisa basada en coincidencia de palabras clave',
            icon: <Type className="w-4 h-4" />
        },
    ];

export const SearchTest: React.FC<SearchTestProps> = ({ collectionId }) => {
    const { t } = useTranslation();
    const { showToast } = useToast();
    const projectId = useAuthStore(state => state.user?.project_id);

    // Search Parameters
    const [query, setQuery] = useState('');
    const [limit, setLimit] = useState(10);
    const [searchMode, setSearchMode] = useState<SearchMode>('hybrid');
    const [contentTypes, setContentTypes] = useState<ContentType[]>(
        CONTENT_TYPES.map(t => t.value)
    );

    // States
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<SearchResultDoc[]>([]);
    const [searchInfo, setSearchInfo] = useState<{
        time: number;
        total: number;
        mode: string;
    } | null>(null);

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!query.trim() || !projectId) return;

        setIsLoading(true);
        try {
            const isAllSelected = contentTypes.length === CONTENT_TYPES.length;

            const response = await KnowledgeBaseApiService.searchDocuments(
                collectionId,
                {
                    query: query.trim(),
                    limit,
                    search_mode: searchMode,
                    filters: isAllSelected ? undefined : { content_type: contentTypes }
                },
                projectId
            );

            setResults(response.results);
            setSearchInfo({
                time: response.search_metadata.search_time_ms,
                total: response.search_metadata.total_results,
                mode: response.search_metadata.search_type,
            });

        } catch (error) {
            console.error('Search failed:', error);
            showToast('error', t('knowledge.search.failed', '搜索失败'), error instanceof Error ? error.message : String(error));
        } finally {
            setIsLoading(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 0.8) return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
        if (score >= 0.5) return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
        return 'text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800';
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
            {/* Left Column: Config */}
            <div className="lg:col-span-4 space-y-6">
                {/* Search Input Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800">
                        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Search className="w-4 h-4 text-blue-500" />
                            {t('knowledge.search.title', '搜索测试')}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">Prueba del efecto de búsqueda en la base de conocimiento, simulando el comportamiento de búsqueda en respuestas AI</p>
                    </div>

                    <div className="p-4 space-y-4">
                        {/* Query Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('knowledge.search.query', '测试文本')}
                            </label>
                            <textarea
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder={t('knowledge.search.placeholder', '输入问题进行测试...')}
                                className="w-full h-28 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none transition-all placeholder:text-gray-400"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSearch();
                                    }
                                }}
                            />
                        </div>

                        {/* Search Button */}
                        <Button
                            onClick={() => handleSearch()}
                            disabled={isLoading || !query.trim()}
                            variant="primary"
                            size="lg"
                            className="w-full h-11 text-base font-medium"
                        >
                            {isLoading ? (
                                <>
                                    <Loader className="w-4 h-4 animate-spin mr-2" />
                                    Buscando...
                                </>
                            ) : (
                                <>
                                    <Search className="w-4 h-4 mr-2" />
                                    Iniciar búsqueda
                                </>
                            )}
                        </Button>

                        {/* Limit */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Cantidad de resultados</span>
                            <input
                                type="number"
                                value={limit}
                                onChange={(e) => setLimit(parseInt(e.target.value) || 10)}
                                min={1}
                                max={50}
                                className="w-20 px-3 py-1.5 text-center bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Search Mode Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                            {t('knowledge.search.mode', '检索模式')}
                        </h3>
                    </div>

                    <div className="p-2">
                        {SEARCH_MODES.map((mode) => (
                            <label
                                key={mode.value}
                                className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${searchMode === mode.value
                                    ? 'bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-200 dark:ring-blue-800'
                                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="searchMode"
                                    value={mode.value}
                                    checked={searchMode === mode.value}
                                    onChange={(e) => setSearchMode(e.target.value as SearchMode)}
                                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className={`${searchMode === mode.value ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
                                            {mode.icon}
                                        </span>
                                        <span className={`font-medium text-sm ${searchMode === mode.value
                                            ? 'text-blue-700 dark:text-blue-300'
                                            : 'text-gray-900 dark:text-gray-100'
                                            }`}>
                                            {mode.name}
                                        </span>
                                        {mode.value === 'hybrid' && (
                                            <Badge variant="info" className="text-[10px] py-0 px-1.5 h-4">
                                                Recomendado
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        {mode.description}
                                    </p>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Content Type Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                            Tipo de contenido
                        </h3>
                        <button
                            onClick={() => {
                                if (contentTypes.length === CONTENT_TYPES.length) {
                                    setContentTypes(['qa_pair']); // 至少保留一个
                                } else {
                                    setContentTypes(CONTENT_TYPES.map(t => t.value));
                                }
                            }}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                            {contentTypes.length === CONTENT_TYPES.length ? 'Quitar selección' : 'Seleccionar todo'}
                        </button>
                    </div>

                    <div className="p-3 grid grid-cols-2 gap-2">
                        {CONTENT_TYPES.map((type) => (
                            <label
                                key={type.value}
                                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all border ${contentTypes.includes(type.value)
                                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border-transparent text-gray-600 dark:text-gray-400'
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={contentTypes.includes(type.value)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setContentTypes([...contentTypes, type.value]);
                                        } else {
                                            if (contentTypes.length > 1) {
                                                setContentTypes(contentTypes.filter(t => t !== type.value));
                                            } else {
                                                showToast('warning', 'Por favor selecciona al menos un tipo de contenido');
                                            }
                                        }
                                    }}
                                    className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
                                />
                                <span className="text-xs font-medium truncate">
                                    {type.name}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Column: Results */}
            <div className="lg:col-span-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                            {t('knowledge.search.results', '检索结果')}
                        </h3>
                        {/* Score Tips */}
                        <div className="group relative">
                            <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                            <div className="absolute left-0 top-6 z-50 w-72 p-3 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                <div className="font-semibold mb-2">Acerca de la puntuación Score</div>
                                <ul className="space-y-1.5 text-gray-300">
                                    <li><span className="text-green-400">1.0</span>: Más relevante, primer lugar</li>
                                    <li><span className="text-yellow-400">0.5-1.0</span>: Alta relevancia</li>
                                    <li><span className="text-gray-400">&lt;0.5</span>: Relevancia media</li>
                                </ul>
                                <div className="mt-2 pt-2 border-t border-gray-700 text-gray-400">
                                    La puntuación se ha normalizado en un rango de 0 a 1. La búsqueda híbrida combina similitud semántica y coincidencia de palabras clave, fusionada y ordenada mediante el algoritmo RRF.
                                </div>
                            </div>
                        </div>
                    </div>
                    {searchInfo && (
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>Tiempo consumido <b className="text-gray-900 dark:text-white">{searchInfo.time}ms</b></span>
                            <span className="w-px h-3 bg-gray-200 dark:bg-gray-700" />
                            <span>Total <b className="text-gray-900 dark:text-white">{searchInfo.total}</b> elementos</span>
                            <span className="w-px h-3 bg-gray-200 dark:bg-gray-700" />
                            <Badge variant="secondary" className="text-[10px]">{searchInfo.mode}</Badge>
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto p-4 bg-gray-50/30 dark:bg-gray-900/30">
                    {results.length === 0 && !isLoading ? (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-gray-400">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                <Info className="w-8 h-8 opacity-40" />
                            </div>
                            <h4 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-1">
                                {query ? 'No se encontraron resultados coincidentes' : 'Listo'}
                            </h4>
                            <p className="text-sm text-gray-500 text-center max-w-sm">
                                {query ? 'Se recomienda intentar cambiar las palabras clave de búsqueda o ajustar el modo de búsqueda' : 'Ingresa una pregunta a la izquierda para comenzar la prueba'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {results.map((result, idx) => {
                                const score = result.relevance_score !== undefined ? result.relevance_score : result.score;
                                const scoreNum = typeof score === 'number' ? score : 0;
                                return (
                                    <div key={idx} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">
                                                    {idx + 1}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        {result.content_type === 'qa_pair' ? (
                                                            <Badge variant="info" className="text-[10px] py-0 px-1.5 h-4">
                                                                QA
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="secondary" className="text-[10px] py-0 px-1.5 h-4">
                                                                Documento
                                                            </Badge>
                                                        )}
                                                        <span className="text-xs text-gray-400">
                                                            {result.metadata?.filename || result.metadata?.source || 'Fuente desconocida'}
                                                        </span>
                                                    </div>
                                                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-0.5 flex items-center gap-1.5">
                                                        <FileText className="w-3.5 h-3.5 text-gray-400" />
                                                        {result.document_title || result.metadata?.filename || 'Sin título'}
                                                    </h4>
                                                </div>
                                            </div>
                                            <div className={`px-2.5 py-1 rounded-md font-mono text-xs font-medium ${getScoreColor(scoreNum)}`}>
                                                {scoreNum.toFixed(4)}
                                            </div>
                                        </div>

                                        <div className={`text-sm leading-relaxed p-3 rounded-lg ${result.content_type === 'qa_pair'
                                            ? 'bg-indigo-50/50 dark:bg-indigo-900/10 text-indigo-900 dark:text-indigo-100'
                                            : 'bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-300'
                                            }`}>
                                            <div className="whitespace-pre-wrap line-clamp-4">
                                                {result.content_preview || result.content}
                                            </div>
                                        </div>

                                        {/* RRF Metadata */}
                                        {result.metadata && (result.metadata.semantic_rank || result.metadata.keyword_rank) && (
                                            <div className="mt-2 flex items-center gap-3 text-[10px] text-gray-400">
                                                {result.metadata.semantic_rank && (
                                                    <span>Ranking semántico: #{result.metadata.semantic_rank}</span>
                                                )}
                                                {result.metadata.keyword_rank && (
                                                    <span>Ranking por palabra clave: #{result.metadata.keyword_rank}</span>
                                                )}
                                                {result.metadata.rrf_score && (
                                                    <span>RRF: {result.metadata.rrf_score}</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            {isLoading && (
                                <div className="space-y-3 animate-pulse">
                                    {[1, 2, 3].map(id => (
                                        <div key={id} className="h-32 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700" />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
