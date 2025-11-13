-- Update menu catalog with customized configuration and metadata
ALTER TABLE public.menu_items
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

DELETE FROM public.item_add_ons;
DELETE FROM public.menu_items;
DELETE FROM public.categories;
DELETE FROM public.add_ons;

WITH inserted_categories AS (
  INSERT INTO public.categories (name, slug, display_order) VALUES
    ('Monte seu Macarrão do seu gosto!', 'monte-seu-macarrao', 1),
    ('Isca Do Dia', 'isca-do-dia', 2),
    ('Combos Completos + Bebida', 'combos-completos-bebida', 3),
    ('Mais Pedidos - Favoritos dos Clie', 'mais-pedidos-favoritos', 4),
    ('Que tal uma Bebida!?', 'que-tal-uma-bebida', 5)
  RETURNING id, slug
),
monte AS (SELECT id FROM inserted_categories WHERE slug = 'monte-seu-macarrao'),
isca AS (SELECT id FROM inserted_categories WHERE slug = 'isca-do-dia'),
combos AS (SELECT id FROM inserted_categories WHERE slug = 'combos-completos-bebida'),
favoritos AS (SELECT id FROM inserted_categories WHERE slug = 'mais-pedidos-favoritos'),
bebidas AS (SELECT id FROM inserted_categories WHERE slug = 'que-tal-uma-bebida')

INSERT INTO public.menu_items (
  category_id,
  name,
  description,
  price,
  image_url,
  is_available,
  is_new,
  is_spicy,
  preparation_time,
  rating,
  review_count,
  metadata
)
VALUES
  (
    (SELECT id FROM monte),
    'Monte seu Macarrão do seu gosto!',
    'Monte o macarrão dos seus sonhos, do jeito que você ama! Escolha sua massa favorita, selecione a carne, os temperos irresistíveis e o molho que mais combina com você. Aqui, a criatividade não tem limites — misture à vontade e crie uma combinação única! Cada ingrediente vem na porção ideal da casa, mas o sabor final é 100% seu. Seja o chef e personalize cada detalhe!',
    34.90,
    'https://client-assets.anota.ai/produtos/657c78a8c091c00012962359/202312261715_FF30_iblob.webp',
    true,
    true,
    false,
    25,
    4.9,
    148,
    jsonb_build_object(
      'tags', jsonb_build_array('custom'),
      'builder', jsonb_build_object(
        'type', 'stepwise',
        'steps', jsonb_build_array(
          jsonb_build_object(
            'name', 'Massas',
            'required', true,
            'min', 1,
            'max', 1,
            'choices', jsonb_build_array(
              jsonb_build_object('label', 'Parafuso', 'price', 34.90),
              jsonb_build_object('label', 'Espaguete integral', 'price', 34.90),
              jsonb_build_object('label', 'Penne', 'price', 34.90),
              jsonb_build_object('label', 'Talharim', 'price', 34.90),
              jsonb_build_object('label', 'Espaguete', 'price', 33.90)
            )
          ),
          jsonb_build_object(
            'name', 'Modo de preparo',
            'required', true,
            'min', 1,
            'max', 1,
            'choices', jsonb_build_array(
              jsonb_build_object('label', 'Preparo na manteiga', 'price', 0),
              jsonb_build_object('label', 'Preparo no azeite', 'price', 0)
            )
          ),
          jsonb_build_object(
            'name', 'Ingredientes',
            'required', true,
            'min', 1,
            'max', 6,
            'choices', jsonb_build_array(
              jsonb_build_object('label', 'Carne de patinho em cubos', 'price', 0),
              jsonb_build_object('label', 'Presunto', 'price', 0),
              jsonb_build_object('label', 'Champignon', 'price', 0),
              jsonb_build_object('label', 'Ovo de codorna', 'price', 0),
              jsonb_build_object('label', 'Palmito', 'price', 0),
              jsonb_build_object('label', 'Salsicha', 'price', 0),
              jsonb_build_object('label', 'Azeitona', 'price', 0),
              jsonb_build_object('label', 'Milho', 'price', 0),
              jsonb_build_object('label', 'Ervilha', 'price', 0),
              jsonb_build_object('label', 'Frango desfiado', 'price', 0),
              jsonb_build_object('label', 'Bacon', 'price', 0),
              jsonb_build_object('label', 'Mini cebola em conserva', 'price', 0),
              jsonb_build_object('label', 'Calabresa', 'price', 0),
              jsonb_build_object('label', 'Tomate seco', 'price', 0),
              jsonb_build_object('label', 'Uva passas', 'price', 0),
              jsonb_build_object('label', 'Cenoura', 'price', 0),
              jsonb_build_object('label', 'Tomate cereja', 'price', 0),
              jsonb_build_object('label', 'Brócolis', 'price', 0),
              jsonb_build_object('label', 'Banana frita', 'price', 0),
              jsonb_build_object('label', 'Mussarela', 'price', 0),
              jsonb_build_object('label', 'Queijo fresco', 'price', 0)
            )
          ),
          jsonb_build_object(
            'name', 'Molho',
            'required', true,
            'min', 1,
            'max', 1,
            'choices', jsonb_build_array(
              jsonb_build_object('label', '4 queijos', 'price', 0),
              jsonb_build_object('label', 'Branco', 'price', 0),
              jsonb_build_object('label', 'Alho e óleo', 'price', 0),
              jsonb_build_object('label', 'Sugo', 'price', 0),
              jsonb_build_object('label', 'Bolonhesa', 'price', 0)
            )
          ),
          jsonb_build_object(
            'name', 'Molho extra',
            'required', false,
            'min', 0,
            'max', 3,
            'choices', jsonb_build_array(
              jsonb_build_object('label', 'Molho branco', 'price', 7.00),
              jsonb_build_object('label', 'Molho Bolonhesa', 'price', 7.00),
              jsonb_build_object('label', 'Molho sugo', 'price', 7.00),
              jsonb_build_object('label', 'Molho 4 queijos', 'price', 7.00)
            )
          ),
          jsonb_build_object(
            'name', 'Adicionais',
            'required', false,
            'min', 0,
            'max', 12,
            'choices', jsonb_build_array(
              jsonb_build_object('label', 'Patinho em cubos', 'price', 5.99),
              jsonb_build_object('label', 'Almôndegas (4un.)', 'price', 5.99),
              jsonb_build_object('label', 'Mozzarela de buffala', 'price', 9.00)
            )
          ),
          jsonb_build_object(
            'name', 'Temperos',
            'required', false,
            'min', 0,
            'max', 4,
            'choices', jsonb_build_array(
              jsonb_build_object('label', 'Cebola Roxa', 'price', 0, 'max_per_item', 10),
              jsonb_build_object('label', 'Pimenta biquinho', 'price', 0, 'max_per_item', 10),
              jsonb_build_object('label', 'Coentro', 'price', 0, 'max_per_item', 10),
              jsonb_build_object('label', 'Batata Palha', 'price', 0.30, 'max_per_item', 10),
              jsonb_build_object('label', 'Pimenta calabresa', 'price', 0, 'max_per_item', 10),
              jsonb_build_object('label', 'Queijo parmesão', 'price', 0.99, 'max_per_item', 10),
              jsonb_build_object('label', 'Chimichurri', 'price', 0, 'max_per_item', 10),
              jsonb_build_object('label', 'Cebolinha', 'price', 0, 'max_per_item', 10),
              jsonb_build_object('label', 'Alho frito', 'price', 0, 'max_per_item', 10)
            )
          ),
          jsonb_build_object(
            'name', 'Turbine',
            'required', false,
            'min', 0,
            'max', 5,
            'choices', jsonb_build_array(
              jsonb_build_object('label', 'Cheddar+', 'price', 3.00),
              jsonb_build_object('label', 'Filé mignon', 'price', 12.00),
              jsonb_build_object('label', 'Muçarela+', 'price', 3.00),
              jsonb_build_object('label', 'Patinho picado', 'price', 12.00),
              jsonb_build_object('label', 'Catupiry+', 'price', 3.00)
            )
          ),
          jsonb_build_object(
            'name', 'Talher',
            'required', true,
            'min', 1,
            'max', 1,
            'choices', jsonb_build_array(
              jsonb_build_object('label', 'Sim pode Mandar', 'price', 0.99),
              jsonb_build_object('label', 'Não preciso!', 'price', 0)
            )
          ),
          jsonb_build_object(
            'name', 'Bebida',
            'required', false,
            'min', 0,
            'max', 5,
            'choices', jsonb_build_array(
              jsonb_build_object('label', 'Cerveja Heineken 290ml', 'price', 12.90),
              jsonb_build_object('label', 'Coca-Cola Lata 350ml', 'price', 8.99),
              jsonb_build_object('label', 'Coca-Cola Original 200ml', 'price', 4.50),
              jsonb_build_object('label', 'Coca Cola Zero Lata 350ml', 'price', 8.99),
              jsonb_build_object('label', 'Coca-Cola 600ml Pet', 'price', 12.90),
              jsonb_build_object('label', 'Suco Néctar de Uva La Fruit 1l', 'price', 14.90),
              jsonb_build_object('label', 'Coca Cola Pet 2l', 'price', 17.90),
              jsonb_build_object('label', 'Cerveja Mexicana Sol Premium Long Neck 330ml', 'price', 11.90),
              jsonb_build_object('label', 'Água sem gás 500ml', 'price', 4.50),
              jsonb_build_object('label', 'Água c/ gás 500ml', 'price', 5.50)
            )
          ),
          jsonb_build_object(
            'name', 'Observações',
            'type', 'textarea',
            'max_length', 200
          )
        )
      )
    )
  ),
  (
    (SELECT id FROM isca),
    'Espaguete ao Alho e Óleo da Casa + Coca-Cola 200ml',
    'Um clássico italiano simples e saboroso: espaguete fresquinho salteado com alho dourado e azeite extra virgem, finalizado com um toque de pimenta. Acompanha uma Coca geladinha de 200ml pra refrescar tudo! Perfeito pro jantar rápido.',
    16.90,
    'https://client-assets.anota.ai/produtos/657c78a8c091c00012962359/202510181530_6L01_iblob.webp',
    true,
    false,
    false,
    18,
    4.7,
    92,
    jsonb_build_object('tags', jsonb_build_array('isca'))
  ),
  (
    (SELECT id FROM combos),
    'Espaguete com Almôndegas Caseiras + Coca-Cola 350ml',
    'Autêntico espaguete al dente acompanhado de 5 suculentas almôndegas artesanais, preparadas com carne moída selecionada, temperadas com ervas especiais e moldadas à mão. Duplo molho irresistível: nosso sugo da casa combinado com encorpado molho bolonhesa, cozidos lentamente para realçar todos os sabores da tradição italiana. Finalizado com queijo parmesão ralado na hora e cebolinha fresca que perfuma deliciosamente o prato. Porção generosa de 500g que satisfaz completamente. Acompanha Coca-Cola gelada 350ml para refrescar. Uma verdadeira receita de família que desperta memórias afetivas da Nonna italiana!',
    38.90,
    'https://client-assets.anota.ai/produtos/657c78a8c091c00012962359/202510181532_563F_iblob.webp',
    true,
    false,
    false,
    22,
    4.8,
    167,
    jsonb_build_object('tags', jsonb_build_array('combo'))
  ),
  (
    (SELECT id FROM combos),
    'Macarrão Alho e óleo da Casa + Coca-Cola Lata 350ml',
    'Escolha sua massa, azeite, alho, bacon (50g), cheiro verde opcional',
    34.90,
    'https://client-assets.anota.ai/produtos/657c78a8c091c00012962359/202510181533_50SW_iblob.webp',
    true,
    false,
    false,
    18,
    4.6,
    121,
    jsonb_build_object('tags', jsonb_build_array('combo'))
  ),
  (
    (SELECT id FROM favoritos),
    'Espaguete à Bolonhesa Caseira',
    'Espaguete al dente com molho bolonhesa tradicional preparado lentamente com carne selecionada e temperos especiais. Porção generosa de 500g.',
    29.90,
    'https://client-assets.anota.ai/produtos/657c78a8c091c00012962359/202510181536_TS0E_iblob.webp',
    true,
    false,
    false,
    20,
    4.9,
    342,
    jsonb_build_object('tags', jsonb_build_array('favorito'))
  ),
  (
    (SELECT id FROM favoritos),
    'Combo: Espaguete Cremoso com Frango e Bacon + Coca-Cola',
    'Espaguete al dente com frango grelhado e bacon crocante + molho cremoso especial da casa + combo completo com bebida incluída + porção generosa 450g + combinação irresistível que satisfaz!',
    38.90,
    'https://client-assets.anota.ai/produtos/657c78a8c091c00012962359/202505202043_J511_blob.webp',
    true,
    false,
    false,
    20,
    4.8,
    208,
    jsonb_build_object('tags', jsonb_build_array('favorito', 'combo'))
  ),
  (
    (SELECT id FROM favoritos),
    'Macarrão Espaguete com Filé Mignon Ao Molho 4 Queijos',
    'Macarrão spaghetti, com 110 gramas de carne filé mingnon, acompanhado de tomate cereja e champignon ao molho 4 queijos e tempero da casa. (porção individual 500 gramas)',
    42.90,
    'https://pedido.anota.ai/assets/item_no_image-DJEgmuUL.png',
    true,
    false,
    false,
    25,
    4.8,
    143,
    jsonb_build_object('tags', jsonb_build_array('favorito'))
  ),
  (
    (SELECT id FROM bebidas),
    'Água sem gás 500ml',
    'Água mineral natural sem gás em garrafa de 500 ml, perfeita para acompanhar seu pedido.',
    5.00,
    'https://client-assets.anota.ai/produtos/657c78a8c091c00012962359/202504291647_RW54_iblob.webp',
    true,
    false,
    false,
    0,
    4.6,
    64,
    jsonb_build_object('tags', jsonb_build_array('bebida'))
  ),
  (
    (SELECT id FROM bebidas),
    'Coca-Cola Lata 350ml',
    'Refrigerante Coca-Cola tradicional em lata de 350 ml, sempre geladinho.',
    8.99,
    'https://client-assets.anota.ai/produtos/657c78a8c091c00012962359/202210200237_btcjxya1zohblob.webp',
    true,
    false,
    false,
    0,
    4.8,
    210,
    jsonb_build_object('tags', jsonb_build_array('bebida'))
  ),
  (
    (SELECT id FROM bebidas),
    'Suco Néctar de Uva La Fruit 1l',
    'Suco néctar sabor uva La Fruit em embalagem de 1 litro.',
    15.00,
    'https://client-assets.anota.ai/produtos/657c78a8c091c00012962359/202504291647_RW54_iblob.webp',
    true,
    false,
    false,
    0,
    4.6,
    74,
    jsonb_build_object('tags', jsonb_build_array('bebida'))
  ),
  (
    (SELECT id FROM bebidas),
    'Água c/ gás 500ml',
    'Água mineral com gás em garrafa de 500 ml.',
    4.50,
    'https://client-assets.anota.ai/produtos/657c78a8c091c00012962359/202504291647_RW54_iblob.webp',
    true,
    false,
    false,
    0,
    4.5,
    52,
    jsonb_build_object('tags', jsonb_build_array('bebida'))
  ),
  (
    (SELECT id FROM bebidas),
    'Coca-Cola Original 200ml',
    'Coca-Cola original em garrafa de 200 ml, ideal para refeições individuais.',
    4.50,
    'https://client-assets.anota.ai/produtos/657c78a8c091c00012962359/202210192220_1uiopbtpix9blob.webp',
    true,
    false,
    false,
    0,
    4.7,
    129,
    jsonb_build_object('tags', jsonb_build_array('bebida'))
  ),
  (
    (SELECT id FROM bebidas),
    'Guaraná Kuat 350ml',
    'Refrigerante Guaraná Kuat em lata de 350 ml.',
    7.00,
    'https://client-assets.anota.ai/produtos/657c78a8c091c00012962359/202310051146_hwdfp8r23u5blob.webp',
    true,
    false,
    false,
    0,
    4.6,
    58,
    jsonb_build_object('tags', jsonb_build_array('bebida'))
  ),
  (
    (SELECT id FROM bebidas),
    'Néctar Maracujá 1l',
    'Suco néctar de maracujá La Fruit em caixa de 1 litro.',
    12.00,
    'https://client-assets.anota.ai/produtos/657c78a8c091c00012962359/202210180331_26pomf4ecrlblob.webp',
    true,
    false,
    false,
    0,
    4.5,
    51,
    jsonb_build_object('tags', jsonb_build_array('bebida'))
  ),
  (
    (SELECT id FROM bebidas),
    'Guaraná Antarctica 2l',
    'Refrigerante Guaraná Antarctica em garrafa PET de 2 litros.',
    16.90,
    'https://client-assets.anota.ai/produtos/657c78a8c091c00012962359/202510171404_sekqgc1ckkgblob.webp',
    true,
    false,
    false,
    0,
    4.6,
    88,
    jsonb_build_object('tags', jsonb_build_array('bebida'))
  ),
  (
    (SELECT id FROM bebidas),
    'Coca-Cola 600ml Pet',
    'Coca-Cola tradicional em garrafa PET de 600 ml.',
    12.90,
    'https://client-assets.anota.ai/produtos/657c78a8c091c00012962359/202405211158_bgjuayqdom6blob.webp',
    true,
    false,
    false,
    0,
    4.6,
    97,
    jsonb_build_object('tags', jsonb_build_array('bebida'))
  ),
  (
    (SELECT id FROM bebidas),
    'Coca Cola Pet 2l',
    'Coca-Cola tradicional em garrafa PET de 2 litros.',
    17.90,
    'https://client-assets.anota.ai/produtos/657c78a8c091c00012962359/202510042113_xrcdbou07kblob.webp',
    true,
    false,
    false,
    0,
    4.7,
    143,
    jsonb_build_object('tags', jsonb_build_array('bebida'))
  ),
  (
    (SELECT id FROM bebidas),
    'Cerveja Mexicana Sol Premium Long Neck 330ml',
    'Cerveja mexicana Sol Premium em long neck de 330 ml.',
    11.90,
    'https://client-assets.anota.ai/produtos/657c78a8c091c00012962359/202510101338_576E_iblob.webp',
    true,
    false,
    false,
    0,
    4.7,
    66,
    jsonb_build_object('tags', jsonb_build_array('bebida'))
  ),
  (
    (SELECT id FROM bebidas),
    'Cerveja Heineken 290ml',
    'Cerveja Heineken original em garrafa de 290 ml.',
    12.90,
    'https://client-assets.anota.ai/produtos/657c78a8c091c00012962359/202510101348_47PC_iblob.webp',
    true,
    false,
    false,
    0,
    4.8,
    73,
    jsonb_build_object('tags', jsonb_build_array('bebida'))
  ),
  (
    (SELECT id FROM bebidas),
    'Coca Cola Zero Lata 350ml',
    'Coca-Cola Zero Açúcar em lata de 350 ml.',
    8.99,
    'https://client-assets.anota.ai/produtos/657c78a8c091c00012962359/202502140946_jfupizo4cikblob.webp',
    true,
    false,
    false,
    0,
    4.6,
    84,
    jsonb_build_object('tags', jsonb_build_array('bebida'))
  );

