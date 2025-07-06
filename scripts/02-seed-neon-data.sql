-- Popular banco com dados de exemplo

-- Inserir agentes
INSERT INTO agents (name, email, phone, whatsapp, creci, bio) VALUES
('Carlos Silva', 'carlos@imovelprime.com.br', '(11) 3000-0001', '5511999887766', 'CRECI-SP 123456', 'Especialista em imóveis residenciais de alto padrão com mais de 10 anos de experiência.'),
('Ana Costa', 'ana@imovelprime.com.br', '(11) 3000-0002', '5511988776655', 'CRECI-SP 234567', 'Corretora sênior especializada em apartamentos de luxo na região da Vila Olímpia.'),
('Roberto Lima', 'roberto@imovelprime.com.br', '(11) 3000-0003', '5511977665544', 'CRECI-SP 345678', 'Especialista em locações residenciais e comerciais.'),
('Mariana Santos', 'mariana@imovelprime.com.br', '(11) 3000-0004', '5511966554433', 'CRECI-SP 456789', 'Corretora especializada em imóveis comerciais e investimentos.');

-- Inserir propriedades
INSERT INTO properties (
    title, description, property_type, transaction_type, price, area, 
    bedrooms, bathrooms, parking_spaces, address, neighborhood, city, state, 
    zip_code, images, features, agent_id, is_featured
) VALUES
(
    'Casa Moderna com Piscina',
    'Belíssima casa moderna com 4 quartos, piscina, churrasqueira e jardim amplo. Localizada em condomínio fechado de alto padrão com segurança 24h.',
    'casa',
    'venda',
    850000.00,
    350.00,
    4,
    3,
    2,
    'Rua das Flores, 123',
    'Jardins',
    'São Paulo',
    'SP',
    '01234-567',
    '["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]',
    '["Piscina", "Churrasqueira", "Jardim", "Segurança 24h", "Condomínio Fechado"]',
    1,
    true
),
(
    'Apartamento de Luxo Vista Panorâmica',
    'Apartamento alto padrão com vista panorâmica da cidade, acabamentos de primeira qualidade e localização privilegiada no coração da Vila Olímpia.',
    'apartamento',
    'venda',
    1200000.00,
    120.00,
    3,
    2,
    2,
    'Av. das Nações Unidas, 456',
    'Vila Olímpia',
    'São Paulo',
    'SP',
    '04578-000',
    '["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]',
    '["Vista Panorâmica", "Acabamento Premium", "Sacada", "Academia", "Salão de Festas"]',
    2,
    true
),
(
    'Casa Familiar Aconchegante',
    'Casa espaçosa perfeita para famílias, com quintal amplo, área gourmet completa e próxima às melhores escolas da região do Morumbi.',
    'casa',
    'aluguel',
    4500.00,
    200.00,
    3,
    2,
    2,
    'Rua do Bosque, 789',
    'Morumbi',
    'São Paulo',
    'SP',
    '05651-030',
    '["https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]',
    '["Quintal Amplo", "Área Gourmet", "Próximo a Escolas", "Garagem Coberta"]',
    3,
    false
),
(
    'Cobertura Duplex Premium',
    'Cobertura duplex com terraço privativo, piscina exclusiva e vista deslumbrante. O mais alto padrão em acabamentos e localização.',
    'apartamento',
    'venda',
    2500000.00,
    280.00,
    4,
    4,
    3,
    'Av. Paulista, 1000',
    'Bela Vista',
    'São Paulo',
    'SP',
    '01310-100',
    '["https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]',
    '["Cobertura Duplex", "Terraço Privativo", "Piscina Exclusiva", "Vista Deslumbrante", "Acabamento Premium"]',
    2,
    true
),
(
    'Apartamento Moderno Brooklin',
    'Apartamento novo com 2 quartos, sendo 1 suíte, em prédio moderno com infraestrutura completa no Brooklin Novo.',
    'apartamento',
    'aluguel',
    3200.00,
    75.00,
    2,
    2,
    1,
    'Rua Funchal, 200',
    'Brooklin',
    'São Paulo',
    'SP',
    '04551-060',
    '["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]',
    '["Apartamento Novo", "Suíte", "Academia", "Piscina", "Salão de Festas"]',
    4,
    false
),
(
    'Casa Térrea com Jardim',
    'Casa térrea charmosa com jardim frontal e quintal nos fundos. Ideal para quem busca tranquilidade sem abrir mão da localização.',
    'casa',
    'venda',
    680000.00,
    180.00,
    3,
    2,
    2,
    'Rua das Palmeiras, 567',
    'Vila Madalena',
    'São Paulo',
    'SP',
    '05435-010',
    '["https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]',
    '["Casa Térrea", "Jardim Frontal", "Quintal", "Localização Privilegiada"]',
    1,
    false
);

-- Inserir configurações do site
INSERT INTO site_settings (setting_key, setting_value, description) VALUES
('company_info', '{
    "name": "Imovel Prime",
    "phone": "(11) 3000-0000",
    "whatsapp": "5511999999999",
    "email": "contato@imovelprime.com.br",
    "address": "Av. Paulista, 1000 - São Paulo, SP",
    "social": {
        "facebook": "https://facebook.com/imovelprime",
        "instagram": "https://instagram.com/imovelprime",
        "linkedin": "https://linkedin.com/company/imovelprime"
    }
}', 'Informações da empresa'),
('site_stats', '{
    "properties_sold": 10000,
    "happy_families": 5000,
    "satisfaction_rate": 98,
    "years_experience": 15
}', 'Estatísticas do site'),
('seo_settings', '{
    "title": "Imovel Prime - Encontre Sua Casa dos Sonhos",
    "description": "A melhor imobiliária de São Paulo. Mais de 15 anos conectando famílias aos seus lares ideais.",
    "keywords": "imóveis, casas, apartamentos, venda, aluguel, São Paulo"
}', 'Configurações de SEO');
