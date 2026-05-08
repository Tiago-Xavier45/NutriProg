<?php
// database/seeders/TacoAlimentosSeeder.php

namespace Database\Seeders;

use App\Models\TacoAlimento;
use Illuminate\Database\Seeder;

class TacoAlimentosSeeder extends Seeder
{
    public function run(): void
    {
        // Evita duplicar se rodar novamente
        if (TacoAlimento::count() > 0) return;

        $alimentos = [
            // Cereais e derivados
            ['nome' => 'Arroz branco cozido',       'categoria' => 'Cereais', 'porcao_padrao' => '100g', 'calorias' => 128, 'proteinas' => 2.5, 'carboidratos' => 28.1, 'gorduras' => 0.2, 'fibras' => 1.6],
            ['nome' => 'Arroz integral cozido',      'categoria' => 'Cereais', 'porcao_padrao' => '100g', 'calorias' => 124, 'proteinas' => 2.6, 'carboidratos' => 25.8, 'gorduras' => 1.0, 'fibras' => 2.7],
            ['nome' => 'Macarrão cozido',            'categoria' => 'Cereais', 'porcao_padrao' => '100g', 'calorias' => 131, 'proteinas' => 4.3, 'carboidratos' => 26.5, 'gorduras' => 0.9, 'fibras' => 1.6],
            ['nome' => 'Pão francês',                'categoria' => 'Cereais', 'porcao_padrao' => '50g',  'calorias' => 300, 'proteinas' => 8.0, 'carboidratos' => 58.6, 'gorduras' => 3.1, 'fibras' => 2.3],
            ['nome' => 'Pão integral',               'categoria' => 'Cereais', 'porcao_padrao' => '50g',  'calorias' => 253, 'proteinas' => 8.8, 'carboidratos' => 48.0, 'gorduras' => 3.2, 'fibras' => 6.9],
            ['nome' => 'Aveia em flocos',            'categoria' => 'Cereais', 'porcao_padrao' => '40g',  'calorias' => 394, 'proteinas' => 13.9,'carboidratos' => 66.6, 'gorduras' => 8.5, 'fibras' => 9.1],
            ['nome' => 'Granola',                    'categoria' => 'Cereais', 'porcao_padrao' => '40g',  'calorias' => 471, 'proteinas' => 8.5, 'carboidratos' => 65.0, 'gorduras' => 19.5,'fibras' => 5.3],
            ['nome' => 'Farinha de trigo',           'categoria' => 'Cereais', 'porcao_padrao' => '100g', 'calorias' => 360, 'proteinas' => 9.8, 'carboidratos' => 75.1, 'gorduras' => 1.4, 'fibras' => 2.3],
            ['nome' => 'Tapioca',                    'categoria' => 'Cereais', 'porcao_padrao' => '100g', 'calorias' => 361, 'proteinas' => 0.2, 'carboidratos' => 88.7, 'gorduras' => 0.2, 'fibras' => 1.5],
            ['nome' => 'Cuscuz de milho cozido',     'categoria' => 'Cereais', 'porcao_padrao' => '100g', 'calorias' => 75,  'proteinas' => 1.9, 'carboidratos' => 16.0, 'gorduras' => 0.3, 'fibras' => 1.2],

            // Carnes
            ['nome' => 'Frango grelhado (peito)',    'categoria' => 'Carnes',  'porcao_padrao' => '100g', 'calorias' => 159, 'proteinas' => 32.8,'carboidratos' => 0.0,  'gorduras' => 2.7, 'fibras' => 0.0],
            ['nome' => 'Frango assado (coxa)',       'categoria' => 'Carnes',  'porcao_padrao' => '100g', 'calorias' => 215, 'proteinas' => 23.5,'carboidratos' => 0.0,  'gorduras' => 13.5,'fibras' => 0.0],
            ['nome' => 'Carne bovina moída grelhada','categoria' => 'Carnes',  'porcao_padrao' => '100g', 'calorias' => 211, 'proteinas' => 27.0,'carboidratos' => 0.0,  'gorduras' => 11.0,'fibras' => 0.0],
            ['nome' => 'Carne bovina patinho cozido','categoria' => 'Carnes',  'porcao_padrao' => '100g', 'calorias' => 219, 'proteinas' => 32.6,'carboidratos' => 0.0,  'gorduras' => 9.5, 'fibras' => 0.0],
            ['nome' => 'Filé de tilápia grelhado',  'categoria' => 'Carnes',  'porcao_padrao' => '100g', 'calorias' => 96,  'proteinas' => 20.1,'carboidratos' => 0.0,  'gorduras' => 1.7, 'fibras' => 0.0],
            ['nome' => 'Atum em lata (água)',        'categoria' => 'Carnes',  'porcao_padrao' => '100g', 'calorias' => 109, 'proteinas' => 24.4,'carboidratos' => 0.0,  'gorduras' => 0.9, 'fibras' => 0.0],
            ['nome' => 'Salmão grelhado',            'categoria' => 'Carnes',  'porcao_padrao' => '100g', 'calorias' => 182, 'proteinas' => 25.4,'carboidratos' => 0.0,  'gorduras' => 8.1, 'fibras' => 0.0],
            ['nome' => 'Ovo cozido',                 'categoria' => 'Carnes',  'porcao_padrao' => '50g',  'calorias' => 146, 'proteinas' => 13.3,'carboidratos' => 0.6,  'gorduras' => 9.5, 'fibras' => 0.0],
            ['nome' => 'Ovo mexido',                 'categoria' => 'Carnes',  'porcao_padrao' => '100g', 'calorias' => 170, 'proteinas' => 12.0,'carboidratos' => 1.5,  'gorduras' => 13.0,'fibras' => 0.0],
            ['nome' => 'Sardinha em lata',           'categoria' => 'Carnes',  'porcao_padrao' => '100g', 'calorias' => 208, 'proteinas' => 23.0,'carboidratos' => 0.0,  'gorduras' => 12.5,'fibras' => 0.0],

            // Leguminosas
            ['nome' => 'Feijão preto cozido',        'categoria' => 'Leguminosas', 'porcao_padrao' => '100g', 'calorias' => 77,  'proteinas' => 4.5, 'carboidratos' => 14.0,'gorduras' => 0.5, 'fibras' => 8.4],
            ['nome' => 'Feijão carioca cozido',      'categoria' => 'Leguminosas', 'porcao_padrao' => '100g', 'calorias' => 76,  'proteinas' => 4.8, 'carboidratos' => 13.6,'gorduras' => 0.5, 'fibras' => 8.5],
            ['nome' => 'Lentilha cozida',            'categoria' => 'Leguminosas', 'porcao_padrao' => '100g', 'calorias' => 93,  'proteinas' => 6.3, 'carboidratos' => 16.3,'gorduras' => 0.5, 'fibras' => 7.9],
            ['nome' => 'Grão-de-bico cozido',        'categoria' => 'Leguminosas', 'porcao_padrao' => '100g', 'calorias' => 164, 'proteinas' => 8.9, 'carboidratos' => 27.4,'gorduras' => 2.6, 'fibras' => 7.6],
            ['nome' => 'Ervilha cozida',             'categoria' => 'Leguminosas', 'porcao_padrao' => '100g', 'calorias' => 70,  'proteinas' => 5.4, 'carboidratos' => 11.4,'gorduras' => 0.2, 'fibras' => 6.3],
            ['nome' => 'Soja cozida',                'categoria' => 'Leguminosas', 'porcao_padrao' => '100g', 'calorias' => 141, 'proteinas' => 14.6,'carboidratos' => 11.5,'gorduras' => 6.8, 'fibras' => 9.0],

            // Laticínios
            ['nome' => 'Leite integral',             'categoria' => 'Laticínios', 'porcao_padrao' => '200ml','calorias' => 61,  'proteinas' => 3.2, 'carboidratos' => 4.5, 'gorduras' => 3.2, 'fibras' => 0.0],
            ['nome' => 'Leite desnatado',            'categoria' => 'Laticínios', 'porcao_padrao' => '200ml','calorias' => 35,  'proteinas' => 3.4, 'carboidratos' => 4.8, 'gorduras' => 0.2, 'fibras' => 0.0],
            ['nome' => 'Iogurte natural integral',   'categoria' => 'Laticínios', 'porcao_padrao' => '170g', 'calorias' => 74,  'proteinas' => 3.9, 'carboidratos' => 5.4, 'gorduras' => 3.8, 'fibras' => 0.0],
            ['nome' => 'Iogurte grego natural',      'categoria' => 'Laticínios', 'porcao_padrao' => '170g', 'calorias' => 97,  'proteinas' => 9.0, 'carboidratos' => 3.6, 'gorduras' => 5.0, 'fibras' => 0.0],
            ['nome' => 'Queijo minas frescal',       'categoria' => 'Laticínios', 'porcao_padrao' => '30g',  'calorias' => 264, 'proteinas' => 17.4,'carboidratos' => 3.2, 'gorduras' => 20.2,'fibras' => 0.0],
            ['nome' => 'Queijo cottage',             'categoria' => 'Laticínios', 'porcao_padrao' => '100g', 'calorias' => 98,  'proteinas' => 11.1,'carboidratos' => 3.4, 'gorduras' => 4.3, 'fibras' => 0.0],
            ['nome' => 'Requeijão cremoso',          'categoria' => 'Laticínios', 'porcao_padrao' => '30g',  'calorias' => 235, 'proteinas' => 7.0, 'carboidratos' => 4.0, 'gorduras' => 21.0,'fibras' => 0.0],
            ['nome' => 'Whey protein (pó)',          'categoria' => 'Laticínios', 'porcao_padrao' => '30g',  'calorias' => 113, 'proteinas' => 22.0,'carboidratos' => 3.5, 'gorduras' => 1.5, 'fibras' => 0.0],

            // Frutas
            ['nome' => 'Banana nanica',              'categoria' => 'Frutas', 'porcao_padrao' => '100g', 'calorias' => 92,  'proteinas' => 1.4, 'carboidratos' => 23.8,'gorduras' => 0.1, 'fibras' => 1.9],
            ['nome' => 'Maçã com casca',             'categoria' => 'Frutas', 'porcao_padrao' => '130g', 'calorias' => 56,  'proteinas' => 0.3, 'carboidratos' => 15.6,'gorduras' => 0.4, 'fibras' => 1.5],
            ['nome' => 'Laranja pera',               'categoria' => 'Frutas', 'porcao_padrao' => '130g', 'calorias' => 46,  'proteinas' => 0.9, 'carboidratos' => 11.5,'gorduras' => 0.1, 'fibras' => 0.8],
            ['nome' => 'Mamão papaia',               'categoria' => 'Frutas', 'porcao_padrao' => '130g', 'calorias' => 40,  'proteinas' => 0.5, 'carboidratos' => 10.4,'gorduras' => 0.1, 'fibras' => 1.8],
            ['nome' => 'Abacate',                    'categoria' => 'Frutas', 'porcao_padrao' => '100g', 'calorias' => 96,  'proteinas' => 1.2, 'carboidratos' => 6.0, 'gorduras' => 8.4, 'fibras' => 6.3],
            ['nome' => 'Morango',                    'categoria' => 'Frutas', 'porcao_padrao' => '100g', 'calorias' => 34,  'proteinas' => 0.7, 'carboidratos' => 7.7, 'gorduras' => 0.3, 'fibras' => 2.0],
            ['nome' => 'Melancia',                   'categoria' => 'Frutas', 'porcao_padrao' => '200g', 'calorias' => 33,  'proteinas' => 0.8, 'carboidratos' => 7.8, 'gorduras' => 0.4, 'fibras' => 0.3],
            ['nome' => 'Uva itália',                 'categoria' => 'Frutas', 'porcao_padrao' => '100g', 'calorias' => 67,  'proteinas' => 0.6, 'carboidratos' => 17.3,'gorduras' => 0.4, 'fibras' => 0.9],
            ['nome' => 'Manga tommy',                'categoria' => 'Frutas', 'porcao_padrao' => '130g', 'calorias' => 64,  'proteinas' => 0.4, 'carboidratos' => 17.0,'gorduras' => 0.3, 'fibras' => 1.6],
            ['nome' => 'Abacaxi',                    'categoria' => 'Frutas', 'porcao_padrao' => '100g', 'calorias' => 48,  'proteinas' => 0.9, 'carboidratos' => 12.3,'gorduras' => 0.1, 'fibras' => 1.0],

            // Verduras e legumes
            ['nome' => 'Alface crespa crua',         'categoria' => 'Verduras', 'porcao_padrao' => '55g',  'calorias' => 11,  'proteinas' => 1.3, 'carboidratos' => 1.8, 'gorduras' => 0.2, 'fibras' => 1.3],
            ['nome' => 'Tomate cru',                 'categoria' => 'Verduras', 'porcao_padrao' => '100g', 'calorias' => 15,  'proteinas' => 1.1, 'carboidratos' => 3.1, 'gorduras' => 0.2, 'fibras' => 1.2],
            ['nome' => 'Cenoura crua',               'categoria' => 'Verduras', 'porcao_padrao' => '80g',  'calorias' => 34,  'proteinas' => 1.3, 'carboidratos' => 7.2, 'gorduras' => 0.2, 'fibras' => 3.2],
            ['nome' => 'Brócolis cozido',            'categoria' => 'Verduras', 'porcao_padrao' => '100g', 'calorias' => 25,  'proteinas' => 2.9, 'carboidratos' => 3.6, 'gorduras' => 0.4, 'fibras' => 2.6],
            ['nome' => 'Espinafre refogado',         'categoria' => 'Verduras', 'porcao_padrao' => '100g', 'calorias' => 21,  'proteinas' => 2.9, 'carboidratos' => 2.6, 'gorduras' => 0.3, 'fibras' => 2.0],
            ['nome' => 'Abobrinha cozida',           'categoria' => 'Verduras', 'porcao_padrao' => '100g', 'calorias' => 20,  'proteinas' => 1.2, 'carboidratos' => 3.4, 'gorduras' => 0.4, 'fibras' => 1.2],
            ['nome' => 'Beterraba cozida',           'categoria' => 'Verduras', 'porcao_padrao' => '100g', 'calorias' => 39,  'proteinas' => 1.5, 'carboidratos' => 8.8, 'gorduras' => 0.1, 'fibras' => 2.9],
            ['nome' => 'Batata doce cozida',         'categoria' => 'Verduras', 'porcao_padrao' => '100g', 'calorias' => 77,  'proteinas' => 1.4, 'carboidratos' => 18.4,'gorduras' => 0.1, 'fibras' => 2.2],
            ['nome' => 'Batata inglesa cozida',      'categoria' => 'Verduras', 'porcao_padrao' => '100g', 'calorias' => 52,  'proteinas' => 1.2, 'carboidratos' => 11.9,'gorduras' => 0.1, 'fibras' => 1.5],
            ['nome' => 'Mandioca cozida',            'categoria' => 'Verduras', 'porcao_padrao' => '100g', 'calorias' => 125, 'proteinas' => 0.6, 'carboidratos' => 30.1,'gorduras' => 0.3, 'fibras' => 1.9],
            ['nome' => 'Couve refogada',             'categoria' => 'Verduras', 'porcao_padrao' => '100g', 'calorias' => 25,  'proteinas' => 2.9, 'carboidratos' => 2.4, 'gorduras' => 0.6, 'fibras' => 2.0],
            ['nome' => 'Pepino cru',                 'categoria' => 'Verduras', 'porcao_padrao' => '100g', 'calorias' => 10,  'proteinas' => 0.7, 'carboidratos' => 2.4, 'gorduras' => 0.1, 'fibras' => 0.8],
            ['nome' => 'Cebola crua',                'categoria' => 'Verduras', 'porcao_padrao' => '50g',  'calorias' => 40,  'proteinas' => 1.1, 'carboidratos' => 9.4, 'gorduras' => 0.1, 'fibras' => 1.5],

            // Gorduras e óleos
            ['nome' => 'Azeite de oliva',            'categoria' => 'Gorduras', 'porcao_padrao' => '10ml', 'calorias' => 884, 'proteinas' => 0.0, 'carboidratos' => 0.0, 'gorduras' => 100.0,'fibras' => 0.0],
            ['nome' => 'Óleo de coco',               'categoria' => 'Gorduras', 'porcao_padrao' => '10ml', 'calorias' => 862, 'proteinas' => 0.0, 'carboidratos' => 0.0, 'gorduras' => 100.0,'fibras' => 0.0],
            ['nome' => 'Manteiga',                   'categoria' => 'Gorduras', 'porcao_padrao' => '10g',  'calorias' => 748, 'proteinas' => 0.6, 'carboidratos' => 0.1, 'gorduras' => 83.5, 'fibras' => 0.0],
            ['nome' => 'Pasta de amendoim integral', 'categoria' => 'Gorduras', 'porcao_padrao' => '32g',  'calorias' => 598, 'proteinas' => 25.3,'carboidratos' => 20.0,'gorduras' => 48.4, 'fibras' => 6.0],
            ['nome' => 'Amendoim torrado',           'categoria' => 'Gorduras', 'porcao_padrao' => '30g',  'calorias' => 567, 'proteinas' => 25.6,'carboidratos' => 18.0,'gorduras' => 43.9, 'fibras' => 8.0],
            ['nome' => 'Castanha do pará',           'categoria' => 'Gorduras', 'porcao_padrao' => '30g',  'calorias' => 656, 'proteinas' => 14.3,'carboidratos' => 15.1,'gorduras' => 63.5, 'fibras' => 7.9],
            ['nome' => 'Castanha de caju torrada',   'categoria' => 'Gorduras', 'porcao_padrao' => '30g',  'calorias' => 570, 'proteinas' => 15.3,'carboidratos' => 29.1,'gorduras' => 43.9, 'fibras' => 3.3],

            // Bebidas
            ['nome' => 'Café sem açúcar',            'categoria' => 'Bebidas', 'porcao_padrao' => '200ml','calorias' => 4,   'proteinas' => 0.3, 'carboidratos' => 0.7, 'gorduras' => 0.0, 'fibras' => 0.0],
            ['nome' => 'Suco de laranja natural',    'categoria' => 'Bebidas', 'porcao_padrao' => '200ml','calorias' => 45,  'proteinas' => 0.7, 'carboidratos' => 10.4,'gorduras' => 0.2, 'fibras' => 0.4],
            ['nome' => 'Água de coco',               'categoria' => 'Bebidas', 'porcao_padrao' => '200ml','calorias' => 19,  'proteinas' => 0.7, 'carboidratos' => 3.7, 'gorduras' => 0.2, 'fibras' => 1.0],
        ];

        TacoAlimento::insert($alimentos);
    }
}