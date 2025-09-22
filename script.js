-- Serviços
local Players = game:GetService("Players")
local LocalPlayer = Players.LocalPlayer
local UserInputService = game:GetService("UserInputService")
local TweenService = game:GetService("TweenService")
local CoreGui = game:GetService("CoreGui")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local RunService = game:GetService("RunService")

-- Criar ScreenGui
local ScreenGui = Instance.new("ScreenGui")
ScreenGui.Parent = LocalPlayer:WaitForChild("PlayerGui")
ScreenGui.ResetOnSpawn = false

-- Variáveis para controle de arraste
local dragging
local dragInput
local dragStart
local startPos

-- Janela principal
local Frame = Instance.new("Frame")
Frame.Size = UDim2.new(0, 250, 0, 220) -- Tamanho inicial
Frame.Position = UDim2.new(0.35, 0, 0.3, 0)
Frame.BackgroundColor3 = Color3.fromRGB(20, 20, 20)
Frame.BorderSizePixel = 0
Frame.Parent = ScreenGui
Instance.new("UICorner", Frame).CornerRadius = UDim.new(0, 8)

-- Barra de título (para arrastar)
local TitleBar = Instance.new("Frame")
TitleBar.Size = UDim2.new(1, 0, 0, 30)
TitleBar.BackgroundColor3 = Color3.fromRGB(30, 30, 30)
TitleBar.BorderSizePixel = 0
TitleBar.Parent = Frame
Instance.new("UICorner", TitleBar).CornerRadius = UDim.new(0, 8)

-- Título centralizado
local Titulo = Instance.new("TextLabel")
Titulo.Size = UDim2.new(0.8, 0, 1, 0)
Titulo.Position = UDim2.new(0.1, 0, 0, 0)
Titulo.BackgroundTransparency = 1
Titulo.Text = "RN TEAM"
Titulo.TextColor3 = Color3.fromRGB(255, 255, 255)
Titulo.Font = Enum.Font.SourceSansBold
Titulo.TextSize = 16
Titulo.TextXAlignment = Enum.TextXAlignment.Center
Titulo.Parent = TitleBar

-- Botão de minimizar
local MinimizeButton = Instance.new("TextButton")
MinimizeButton.Size = UDim2.new(0, 30, 0, 30)
MinimizeButton.Position = UDim2.new(1, -30, 0, 0)
MinimizeButton.BackgroundTransparency = 1
MinimizeButton.Text = "-"
MinimizeButton.TextColor3 = Color3.fromRGB(255, 255, 255)
MinimizeButton.Font = Enum.Font.SourceSansBold
MinimizeButton.TextSize = 20
MinimizeButton.Parent = TitleBar

-- Container para o conteúdo COM ROLAGEM (sem barra visível)
local ContentContainer = Instance.new("ScrollingFrame")
ContentContainer.Size = UDim2.new(1, -10, 1, -60)
ContentContainer.Position = UDim2.new(0, 5, 0, 35)
ContentContainer.BackgroundTransparency = 1
ContentContainer.BorderSizePixel = 0
ContentContainer.ScrollBarThickness = 0 -- Barra de rolagem invisível
ContentContainer.ScrollBarImageColor3 = Color3.fromRGB(0, 0, 0)
ContentContainer.ScrollBarImageTransparency = 1 -- Totalmente transparente
ContentContainer.ClipsDescendants = true
ContentContainer.Parent = Frame

-- Layout para organizar os elementos
local UIListLayout = Instance.new("UIListLayout")
UIListLayout.Padding = UDim.new(0, 10)
UIListLayout.Parent = ContentContainer

-- Texto fixo embaixo (créditos)
local Creditos = Instance.new("TextLabel")
Creditos.Size = UDim2.new(1, 0, 0, 30)
Creditos.Position = UDim2.new(0, 0, 1, -30)
Creditos.BackgroundTransparency = 1
Creditos.Text = "YouTube: RN_TEAM"
Creditos.TextColor3 = Color3.fromRGB(200, 200, 200)
Creditos.Font = Enum.Font.SourceSansBold
Creditos.TextSize = 16
Creditos.Parent = Frame

-- Frame de fundo para permitir arrastar por toda a interface
local BackgroundDrag = Instance.new("Frame")
BackgroundDrag.Size = UDim2.new(1, 0, 1, 0)
BackgroundDrag.BackgroundTransparency = 1
BackgroundDrag.BorderSizePixel = 0
BackgroundDrag.ZIndex = 0
BackgroundDrag.Parent = Frame

-- Função para arrastar a janela
local function update(input)
	local delta = input.Position - dragStart
	Frame.Position = UDim2.new(startPos.X.Scale, startPos.X.Offset + delta.X, startPos.Y.Scale, startPos.Y.Offset + delta.Y)
end

-- Conectar eventos de arraste à barra de título e ao fundo
local function connectDragEvents(frame)
	frame.InputBegan:Connect(function(input)
		if input.UserInputType == Enum.UserInputType.MouseButton1 or input.UserInputType == Enum.UserInputType.Touch then
			dragging = true
			dragStart = input.Position
			startPos = Frame.Position
			
			input.Changed:Connect(function()
				if input.UserInputState == Enum.UserInputState.End then
					dragging = false
				end
			end)
		end
	end)

	frame.InputChanged:Connect(function(input)
		if input.UserInputType == Enum.UserInputType.MouseMovement or input.UserInputType == Enum.UserInputType.Touch then
			dragInput = input
		end
	end)
end

-- Conectar eventos de arraste à barra de título e ao fundo
connectDragEvents(TitleBar)
connectDragEvents(BackgroundDrag)

UserInputService.InputChanged:Connect(function(input)
	if input == dragInput and dragging then
		update(input)
	end
end)

-- Função para ajustar automaticamente a altura da janela
local function ajustarAlturaJanela()
    local alturaMinima = 220 -- Altura mínima da janela
    local alturaMaxima = 400 -- Altura máxima da janela
    local alturaConteudo = UIListLayout.AbsoluteContentSize.Y + 80 -- Conteúdo + margens
    
    -- Calcular nova altura (limitar entre mínimo e máximo)
    local novaAltura = math.clamp(alturaConteudo, alturaMinima, alturaMaxima)
    
    -- Ajustar altura da janela com animação suave
    local tween = TweenService:Create(
        Frame,
        TweenInfo.new(0.3, Enum.EasingStyle.Quad, Enum.EasingDirection.Out),
        {Size = UDim2.new(0, 250, 0, novaAltura)}
    )
    tween:Play()
    
    -- Ajustar a área de rolagem
    ContentContainer.CanvasSize = UDim2.new(0, 0, 0, UIListLayout.AbsoluteContentSize.Y)
end

-- Função para minimizar/maximizar
local isMinimized = false
local originalSize = Frame.Size
local minimizedSize = UDim2.new(0, 250, 0, 30)

MinimizeButton.MouseButton1Click:Connect(function()
	isMinimized = not isMinimized
	
	if isMinimized then
		-- Minimizar
		local tween = TweenService:Create(
			Frame,
			TweenInfo.new(0.3, Enum.EasingStyle.Quad, Enum.EasingDirection.Out),
			{Size = minimizedSize}
		)
		tween:Play()
		ContentContainer.Visible = false
		Creditos.Visible = false
		BackgroundDrag.Visible = false
		MinimizeButton.Text = "+"
	else
		-- Maximizar
		local tween = TweenService:Create(
			Frame,
			TweenInfo.new(0.3, Enum.EasingStyle.Quad, Enum.EasingDirection.Out),
			{Size = originalSize}
		)
		tween:Play()
		ContentContainer.Visible = true
		Creditos.Visible = true
		BackgroundDrag.Visible = true
		MinimizeButton.Text = "-"
	end
end)

-- Botão estilo barra
local function CriarBotao(texto, callback)
	local Botao = Instance.new("TextButton")
	Botao.Size = UDim2.new(1, 0, 0, 35)
	Botao.BackgroundColor3 = Color3.fromRGB(50, 50, 50)
	Botao.Text = texto
	Botao.TextColor3 = Color3.fromRGB(255, 255, 255)
	Botao.Font = Enum.Font.SourceSansBold
	Botao.TextSize = 18
	Botao.ZIndex = 1
	Botao.Parent = ContentContainer
	Instance.new("UICorner", Botao).CornerRadius = UDim.new(0, 6)

	-- efeito hover
	Botao.MouseEnter:Connect(function()
		Botao.BackgroundColor3 = Color3.fromRGB(80, 80, 80)
	end)
	Botao.MouseLeave:Connect(function()
		Botao.BackgroundColor3 = Color3.fromRGB(50, 50, 50)
	end)

	Botao.MouseButton1Click:Connect(callback)
	return Botao
end

-- Toggle (checkbox)
local function CriarToggle(texto, callback)
    local ToggleContainer = Instance.new("Frame")
    ToggleContainer.Size = UDim2.new(1, 0, 0, 30)
    ToggleContainer.BackgroundTransparency = 1
    ToggleContainer.ZIndex = 1
    ToggleContainer.Parent = ContentContainer

    local Toggle = Instance.new("TextButton")
    Toggle.Size = UDim2.new(1, 0, 1, 0)
    Toggle.BackgroundTransparency = 1
    Toggle.Text = texto
    Toggle.TextColor3 = Color3.fromRGB(255, 255, 255)
    Toggle.Font = Enum.Font.SourceSansBold
    Toggle.TextSize = 18
    Toggle.TextXAlignment = Enum.TextXAlignment.Left
    Toggle.ZIndex = 1
    Toggle.Parent = ToggleContainer

    local Box = Instance.new("Frame", Toggle)
    Box.Size = UDim2.new(0, 20, 0, 20)
    Box.Position = UDim2.new(1, -25, 0.5, -10)
    Box.BackgroundColor3 = Color3.fromRGB(40, 40, 40)
    Box.ZIndex = 1
    Instance.new("UICorner", Box).CornerRadius = UDim.new(0, 4)

    return Toggle, Box
end

-- SISTEMA AUTO FARM (NPC Gatherer)
local autoFarmSystem = {
    active = false,
    connection = nil,
    
    -- Configurações
    SETTINGS = {
        NPC_FOLDER_NAMES = {"Enemys"},
        MAX_DISTANCE = 900,
        PULL_DISTANCE = 30,
        LOOP_DELAY = 0.2,
        BUFF_COOLDOWN = 60
    },
    
    -- Variáveis
    lastBuffTime = 0,
    npcFolder = nil,
    
    -- Encontrar a pasta correta de NPCs
    findNPCDirectory = function(self)
        for _, folderName in ipairs(self.SETTINGS.NPC_FOLDER_NAMES) do
            local folder = workspace:FindFirstChild(folderName)
            if folder then
                return folder
            end
        end
        return nil
    end,
    
    -- Aplicar buffs (adaptar para o jogo específico)
    applyBuffs = function(self)
        if time() - self.lastBuffTime < self.SETTINGS.BUFF_COOLDOWN then
            return
        end
        
        print("[BUFF] Aplicando buffs...")
        self.lastBuffTime = time()
        
        -- Exemplo de buff - adapte para seu jogo
        local character = LocalPlayer.Character
        if character then
            local humanoid = character:FindFirstChild("Humanoid")
            if humanoid then
                -- Simula algum efeito de buff
                humanoid.WalkSpeed = 90 -- Aumenta velocidade temporariamente
                delay(10, function()
                    if humanoid then
                        humanoid.WalkSpeed = 90 -- Volta ao normal
                    end
                end)
            end
        end
    end,
    
    -- Puxar NPC para perto do jogador
    pullNPC = function(self, npcModel, humanoidRootPart)
        if not npcModel or not npcModel:FindFirstChild("HumanoidRootPart") or not humanoidRootPart then
            return false
        end
        
        local npcHRP = npcModel.HumanoidRootPart
        local distance = (humanoidRootPart.Position - npcHRP.Position).Magnitude
        
        if distance > self.SETTINGS.PULL_DISTANCE and distance < self.SETTINGS.MAX_DISTANCE then
            -- Move o NPC para perto do jogador
            local direction = (humanoidRootPart.Position - npcHRP.Position).Unit
            npcHRP.CFrame = CFrame.new(
                humanoidRootPart.Position + direction * 5,
                humanoidRootPart.Position
            )
            return true
        end
        return false
    end,
    
    -- Função principal do loop
    mainLoop = function(self)
        if not self.active then return end
        
        local character = LocalPlayer.Character
        local humanoidRootPart = character and character:FindFirstChild("HumanoidRootPart")
        
        if not character or not humanoidRootPart then
            return
        end
        
        -- Aplica buffs primeiro
        self:applyBuffs()
        
        -- Encontra a pasta de NPCs se não tiver encontrado ainda
        if not self.npcFolder then
            self.npcFolder = self:findNPCDirectory()
            if not self.npcFolder then
                warn("Nenhuma pasta de NPCs encontrada!")
                return
            end
        end
        
        -- Junta os NPCs
        local gathered = 0
        for _, npc in ipairs(self.npcFolder:GetChildren()) do
            if not self.active then break end
            
            if npc:IsA("Model") and npc:FindFirstChild("Humanoid") and npc.Humanoid.Health > 0 then
                if self:pullNPC(npc, humanoidRootPart) then
                    gathered += 1
                    wait(0.3) -- Delay entre puxadas
                end
            end
        end
        
        if gathered > 0 then
            print("[NPC GATHER] " .. gathered .. " NPCs juntados!")
        end
    end,
    
    -- Iniciar o auto farm
    start = function(self)
        if self.active then return end
        
        self.active = true
        self.npcFolder = nil
        self.lastBuffTime = 0
        
        print("🟢 Auto Farm INICIADO!")
        print("Procurando por pastas: " .. table.concat(self.SETTINGS.NPC_FOLDER_NAMES, ", "))
        
        -- Criar loop usando RunService para melhor performance
        self.connection = RunService.Heartbeat:Connect(function()
            if not self.active then return end
            pcall(function() self:mainLoop() end)
            wait(self.SETTINGS.LOOP_DELAY)
        end)
    end,
    
    -- Parar o auto farm
    stop = function(self)
        if not self.active then return end
        
        self.active = false
        
        if self.connection then
            self.connection:Disconnect()
            self.connection = nil
        end
        
        print("🔴 Auto Farm PARADO!")
    end
}

-- Toggle Auto Farm
local AutoFarmToggle, AutoFarmBox = CriarToggle("auto farm", function() end)

AutoFarmToggle.MouseButton1Click:Connect(function()
    if autoFarmSystem.active then
        -- Desligar
        AutoFarmBox.BackgroundColor3 = Color3.fromRGB(40, 40, 40)
        autoFarmSystem:stop()
    else
        -- Ligar
        AutoFarmBox.BackgroundColor3 = Color3.fromRGB(0, 200, 0)
        autoFarmSystem:start()
    end
end)

-- SISTEMA AUTO RAID
local autoRaidSystem = {
    isPart1Active = false,
    isPart2Active = false,
    stopDetected = false,
    seenMessages = {},
    
    -- CONFIGURAÇÕES
    START_TEXT = "7,Demon Castle",
    STOP_TEXT = "heroes are",
    
    -- Ação executada quando para (tanto pelo chat quanto pelo botão)
    executeStopAction = function(self)
        print("🛑 EXECUTANDO AÇÃO DE PARADA...")
        
        -- Aqui você pode adicionar qualquer ação que queira fazer quando parar
        -- Por exemplo: teleportar de volta, fechar interfaces, etc.
        
        -- Exemplo: Teleportar para o spawn original
        local args = {{mapId = 10001}} -- ID do mapa spawn padrão
        ReplicatedStorage:WaitForChild("Remotes"):WaitForChild("LocalPlayerTeleport"):FireServer(unpack(args))
        
        print("✅ Ação de parada concluída!")
    end,
    
    -- Iniciar Parte 1 (Detector de Chat)
    startPart1 = function(self)
        print("🔍 PARTE 1 INICIADA - Esperando: '" .. self.START_TEXT .. "'")
        self.isPart1Active = true
        self.stopDetected = false
        
        while self.isPart1Active and not self.stopDetected do
            task.wait(0.3)

            -- Verificar se foi parado pelo botão
            if not _G.autoRaid then
                print("🛑 PARADO PELO BOTÃO - Executando ação de parada...")
                self:executeStopAction()
                break
            end

            for _, gui in pairs({CoreGui, LocalPlayer.PlayerGui}) do
                for _, textLabel in pairs(gui:GetDescendants()) do
                    if textLabel:IsA("TextLabel") and textLabel.Text ~= "" then
                        local text = textLabel.Text

                        if not self.seenMessages[text] then
                            self.seenMessages[text] = true

                            if string.find(text, self.START_TEXT) then
                                print("✅ MENSAGEM DE INICIO: '" .. text .. "'")
                                self.isPart1Active = false
                                print("🔴 PARTE 1 DESLIGADA")
                                self.isPart2Active = true
                                self.stopDetected = false
                                print("🟢 PARTE 2 INICIANDO")

                                task.spawn(function()
                                    print("🚀 Ativando teleport...")
                                    local args1 = {{mapId = 50007}}
                                    ReplicatedStorage:WaitForChild("Remotes"):WaitForChild("LocalPlayerTeleport"):FireServer(unpack(args1))

                                    print("⏳ Esperando 3 segundos para teleportar...")
                                    task.wait(3)

                                    if LocalPlayer.Character and LocalPlayer.Character:FindFirstChild("HumanoidRootPart") then
                                        print("✅ Player teleportado, ativando raid map...")
                                        local args2 = {1000002}
                                        ReplicatedStorage:WaitForChild("Remotes"):WaitForChild("EnterCityRaidMap"):FireServer(unpack(args2))

                                        task.wait(2)
                                        print("🎯 Iniciando NPC Gatherer...")
                                        self:startPart2()
                                    else
                                        print("❌ Falha no teleport, reativando Parte 1")
                                        self.isPart1Active = true
                                        self.isPart2Active = false
                                        self:startPart1()
                                    end
                                end)
                                return
                            end
                        end
                    end
                end
            end
        end
    end,
    
    -- Iniciar Parte 2 (NPC Gatherer)
    startPart2 = function(self)
        print("⚔️ PARTE 2 INICIADA - Modo NPC Gatherer")
        print("📋 Escreva '" .. self.STOP_TEXT .. "' no chat para parar")

        local SETTINGS = {
            NPC_FOLDER_NAME = "Enemys",
            MAX_DISTANCE = 900,
            LOOP_DELAY = 1.0
        }

        local npcFolder = workspace:FindFirstChild(SETTINGS.NPC_FOLDER_NAME)
        if not npcFolder then
            print("❌ Pasta de NPCs não encontrada!")
            self.isPart1Active = true
            self.isPart2Active = false
            self:startPart1()
            return
        end

        local function checkForStopMessage()
            for _, gui in pairs({CoreGui, LocalPlayer.PlayerGui}) do
                for _, textLabel in pairs(gui:GetDescendants()) do
                    if textLabel:IsA("TextLabel") and textLabel.Text ~= "" then
                        local text = textLabel.Text
                        if not self.seenMessages[text] then
                            self.seenMessages[text] = true
                            if string.find(text, self.STOP_TEXT) then
                                print("🛑 MENSAGEM DE PARADA: '" .. text .. "'")
                                self.stopDetected = true
                                self:executeStopAction() -- Executar ação de parada
                                return
                            end
                        end
                    end
                end
            end
        end

        while self.isPart2Active and not self.stopDetected do
            -- Verificar se foi parado pelo botão
            if not _G.autoRaid then
                print("🛑 PARADO PELO BOTÃO NA PARTE 2 - Executando ação de parada...")
                self:executeStopAction()
                break
            end

            checkForStopMessage()

            local character = LocalPlayer.Character
            local humanoidRootPart = character and character:FindFirstChild("HumanoidRootPart")
            if not character or not humanoidRootPart then
                print("⏳ Aguardando character...")
                task.wait(1)
                continue
            end

            if not workspace:FindFirstChild(SETTINGS.NPC_FOLDER_NAME) then
                print("❌ Pasta de NPCs removida!")
                break
            end

            print("⏳ Preparando para puxar NPCs...")
            task.wait(3)

            local gathered = 0
            for _, npc in pairs(npcFolder:GetChildren()) do
                if not self.isPart2Active or self.stopDetected or not _G.autoRaid then break end

                if npc:IsA("Model") then
                    local humanoid = npc:FindFirstChild("Humanoid")
                    local npcHRP = npc:FindFirstChild("HumanoidRootPart")

                    if humanoid and npcHRP and humanoid.Health > 0 then
                        local distance = (humanoidRootPart.Position - npcHRP.Position).Magnitude
                        if distance < SETTINGS.MAX_DISTANCE then
                            npcHRP.CFrame = humanoidRootPart.CFrame * CFrame.new(math.random(-5,5), 0, math.random(-5,5))
                            gathered += 1
                        end
                    end
                end
            end

            if gathered > 0 then
                print("👥 " .. gathered .. " NPCs puxados de uma vez!")
            else
                print("🔍 Nenhum NPC encontrado ativo")
            end

            task.wait(SETTINGS.LOOP_DELAY)
        end

        print("🔴 PARTE 2 PARADA")
        self.isPart2Active = false
        
        -- Se não foi parado pelo botão, voltar para Parte 1
        if _G.autoRaid and not self.stopDetected then
            self.isPart1Active = true
            self:startPart1()
        else
            self:executeStopAction() -- Executar ação de parada final
        end
    end,
    
    -- Parar sistema
    stop = function(self)
        self.isPart1Active = false
        self.isPart2Active = false
        self.stopDetected = true
        self:executeStopAction() -- Executar ação de parada
        print("🛑 SISTEMA AUTO RAID PARADO")
    end
}

-- Toggle Auto Raid
local AutoRaidToggle, AutoRaidBox = CriarToggle("Auto Raid", function() end)

AutoRaidToggle.MouseButton1Click:Connect(function()
    _G.autoRaid = not _G.autoRaid
    if _G.autoRaid then
        AutoRaidBox.BackgroundColor3 = Color3.fromRGB(0, 200, 0)
        print("🟢 Auto Raid ATIVADO")
        autoRaidSystem:startPart1()
    else
        AutoRaidBox.BackgroundColor3 = Color3.fromRGB(40, 40, 40)
        print("🔴 Auto Raid DESATIVADO")
        autoRaidSystem:stop()
    end
end)

-- Ajustar automaticamente a altura da janela e a rolagem
UIListLayout:GetPropertyChangedSignal("AbsoluteContentSize"):Connect(function()
    ContentContainer.CanvasSize = UDim2.new(0, 0, 0, UIListLayout.AbsoluteContentSize.Y)
    ajustarAlturaJanela() -- Ajusta a altura da janela automaticamente
end)

local b1 = CriarBotao("nada", function()
	print("Steal Best Fish clicado")
end)

local b1 = CriarBotao("nada", function()
	print("Steal Best Fish clicado")
end)

local b1 = CriarBotao("nada", function()
	print("Steal Best Fish clicado")
end)

local b1 = CriarBotao("nada", function()
	print("Steal Best Fish clicado")
end)

-- Ajustar altura inicial
task.wait(0.1)
ajustarAlturaJanela()

print("🚀 INTERFACE RN TEAM CARREGADA!")