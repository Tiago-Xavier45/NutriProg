import { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { usePage } from '@inertiajs/react';

interface TacoFood {
    id: number;
    nome: string;
    categoria: string;
    porcao: string;
    calorias: number;
    proteinas: number;
    carboidratos: number;
    gorduras: number;
}

interface FoodSearchProps {
    value: string;
    portion: string;
    calories: number;

   onChange: (
    name: string,
    portion: string,
    calories: number,
    per100g: {
        calorias: number;
        proteinas: number;
        carboidratos: number;
        gorduras: number;
    } | undefined
) => void;

    onClear: () => void;
}

export function FoodSearch({
    value,
    portion,
    calories,
    onChange,
    onClear,
}: FoodSearchProps) {
    const [query, setQuery] = useState(value);
    const [results, setResults] = useState<TacoFood[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const debounceRef = useRef<ReturnType<typeof setTimeout>>();
    const wrapperRef = useRef<HTMLDivElement>(null);

    const page = usePage();
    const baseUrl = page.props.currentTeam
        ? `/${page.props.currentTeam.slug}`
        : '';

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handler);

        return () =>
            document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => {
        setQuery(value);
    }, [value]);

    const search = (q: string) => {
        setQuery(q);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (q.length < 2) {
            setResults([]);
            setOpen(false);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            setLoading(true);

            try {
                const res = await fetch(
                    `${baseUrl}/taco/buscar?q=${encodeURIComponent(q)}`
                );

                const data = await res.json();

                setResults(data);
                setOpen(true);
            } catch {
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 300);
    };

    // ✅ extrai gramas da string da porção
    const extractGrams = (portion: string): number => {
        const match = portion.match(/(\d+)\s*g/i);

        if (!match) return 100;

        return Number(match[1]);
    };

    const select = (food: TacoFood) => {
        setQuery(food.nome);
        setOpen(false);
        setResults([]);

        const grams = extractGrams(food.porcao);

        const ratio = grams / 100;

        const calculatedCalories = Math.round(
            food.calorias * ratio
        );

        onChange(
            food.nome,
            food.porcao,
            calculatedCalories,
            {
                calorias: food.calorias,
                proteinas: food.proteinas,
                carboidratos: food.carboidratos,
                gorduras: food.gorduras,
            },
            grams
        );
    };

    const clear = () => {
        setQuery('');
        setResults([]);
        setOpen(false);

        onClear();
    };

    return (
        <div ref={wrapperRef} className="relative flex-1">
            <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />

                <input
                    type="text"
                    value={query}
                    onChange={(e) => search(e.target.value)}
                    onFocus={() => results.length > 0 && setOpen(true)}
                    placeholder="Buscar alimento..."
                    className="w-full rounded border-0 bg-transparent py-1 pl-7 pr-6 text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />

                {query && (
                    <button
                        onClick={clear}
                        className="absolute right-1 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                )}
            </div>

            {open && (
                <div className="absolute left-0 top-full z-50 mt-1 w-72 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
                    {loading ? (
                        <div className="flex items-center gap-2 p-3 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Buscando...
                        </div>
                    ) : results.length === 0 ? (
                        <div className="p-3 text-sm text-muted-foreground">
                            Nenhum alimento encontrado
                        </div>
                    ) : (
                        <ul className="max-h-56 overflow-y-auto">
                            {results.map((food) => (
                                <li key={food.id}>
                                    <button
                                        type="button"
                                        onClick={() => select(food)}
                                        className="w-full px-3 py-2.5 text-left transition hover:bg-muted"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-sm font-medium text-foreground">
                                                {food.nome}
                                            </span>

                                            <span className="whitespace-nowrap text-xs font-medium text-primary">
                                                {Math.round(food.calorias)} kcal
                                            </span>
                                        </div>

                                        <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                                            <span>{food.porcao}</span>
                                            <span>P: {food.proteinas}g</span>
                                            <span>C: {food.carboidratos}g</span>
                                            <span>G: {food.gorduras}g</span>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}