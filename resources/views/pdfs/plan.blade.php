<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Plano Alimentar - {{ $plano->cliente->name ?? 'Paciente' }}</title>
    <style>
        * {
            box-sizing: border-box;
        }
        
        body { 
            font-family: DejaVu Sans, sans-serif; 
            font-size: 12px; 
            line-height: 1.4;
            margin: 0;
            padding: 20px;
            color: #333;
        }
        
        @media print {
            body {
                margin: 0;
                padding: 15mm;
                
            }
            
            @page {
                size: A4;
                margin: 15mm;
            }
            
            .no-print {
                display: none !important;
            }
            
            .page-break {
                page-break-after: always;
            }
            
            header {
                margin-bottom: 15px;
            }
        }
        
        .no-print {
            text-align: center;
            margin-bottom: 20px;
            padding: 15px;
            background-color: #f5f5f5;
            border-radius: 5px;
        }
        
        .print-button {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 14px;
            border-radius: 4px;
            cursor: pointer;
            margin-right: 10px;
        }
        
        .print-button:hover {
            background-color: #45a049;
        }
        
        .hint {
            font-size: 11px;
            color: #666;
            margin-top: 8px;
        }
        
        header { 
            text-align: center; 
            margin-bottom: 20px; 
            border-bottom: 2px solid #4CAF50;
            padding-bottom: 15px;
        }
        
        h1 { 
            margin: 0; 
            font-size: 24px; 
            color: #2c3e50;
        }
        
        .sub { 
            font-size: 12px; 
            color: #555; 
            margin-top: 8px;
        }
        
        h2 { 
            margin-top: 20px; 
            font-size: 16px; 
            border-bottom: 1px solid #ddd; 
            padding-bottom: 6px; 
            color: #2c3e50;
        }
        
        h3 {
            font-size: 14px;
            color: #34495e;
            margin-top: 15px;
            margin-bottom: 8px;
        }
        
        p {
            margin: 6px 0;
        }
        
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 8px; 
        }
        
        th, td { 
            border: 1px solid #ddd; 
            padding: 8px; 
            text-align: left; 
        }
        
        th {
            background-color: #f5f5f5;
            font-weight: bold;
        }
        
        ul { 
            margin: 0; 
            padding-left: 20px; 
            list-style-type: disc;
        }
        
        li {
            margin-bottom: 4px;
        }
        
        .footer { 
            margin-top: 30px; 
            padding-top: 15px;
            border-top: 1px solid #ddd;
            text-align: center; 
            font-size: 10px; 
            color: #777; 
        }
        
        .info-box {
            background-color: #f9f9f9;
            border-left: 4px solid #4CAF50;
            padding: 10px;
            margin: 10px 0;
        }
    </style>
    
    <script>
        function printPage() {
            window.print();
        }
    </script>
</head>
<body>
    <div class="no-print">
        <button class="print-button" onclick="printPage()">Imprimir / Salvar como PDF</button>
        <button class="print-button" onclick="window.close()" style="background-color: #f44336;">Fechar</button>
        <p class="hint">Use o botão acima ou pressione Ctrl+P para imprimir/salvar como PDF</p>
    </div>

    <header>
        <h1>Plano Alimentar</h1>
        <div class="sub">
            <strong>Paciente:</strong> {{ $plano->cliente->name ?? 'Paciente' }} &nbsp;|&nbsp;
            <strong>Plano:</strong> {{ $plano->nome ?? '' }} &nbsp;|&nbsp;
            <strong>Emitido em:</strong> {{ now()->format('d/m/Y H:i') }}
        </div>
    </header>

    <section>
        <h2>Resumo do Plano</h2>
        <div class="info-box">
            <p><strong>Objetivo:</strong> {{ $plano->objetivo ?? 'N/A' }}</p>
            <p><strong>Calorias diárias:</strong> {{ $plano->calorias ?? 'N/A' }} kcal</p>
            @if(!empty($plano->restricoes))
                <p><strong>Restrições:</strong> {{ implode(', ', $plano->restricoes) }}</p>
            @endif
            @if(!empty($plano->observacoes))
                <p><strong>Observações:</strong> {{ $plano->observacoes }}</p>
            @endif
        </div>
    </section>

    <section>
        <h2>Refeições do Dia</h2>
        @if($plano->refeicoes->count() > 0)
            @foreach($plano->refeicoes as $refeicao)
                <div style="margin-bottom: 15px;">
                    <h3>{{ $refeicao->nome }} - {{ substr($refeicao->horario, 0, 5) }}</h3>
                    @if($refeicao->alimentos->count() > 0)
                        <ul>
                            @foreach($refeicao->alimentos as $alimento)
                                <li>
                                    <strong>{{ $alimento->nome }}</strong>
                                    @if($alimento->porcao)
                                        - {{ $alimento->porcao }}
                                    @endif
                                    @if($alimento->calorias)
                                        ({{ $alimento->calorias }} kcal)
                                    @endif
                                </li>
                            @endforeach
                        </ul>
                    @else
                        <p style="color: #999; font-style: italic;">Nenhum alimento cadastrado para esta refeição.</p>
                    @endif
                </div>
            @endforeach
        @else
            <p style="color: #999; font-style: italic;">Nenhuma refeição cadastrada neste plano.</p>
        @endif
    </section>

    <div class="footer">
        <p>Núcleo NutriPro - Sistema de Gestão Nutricional</p>
        <p>Este documento foi gerado em {{ now()->format('d/m/Y H:i:s') }}</p>
    </div>
</body>
</html>
