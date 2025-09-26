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
Frame.Size = UDim2.new(0, 250, 0, 250) -- Tamanho inicial aumentado
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
    local alturaMinima = 250 -- Altura mínima da janela aumentada
    local alturaMaxima = 450 -- Altura máxima da janela aumentada
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

-- SISTEMA AUTO RAID V1
local autoRaidSystem = {
    active = false,
    connection = nil,
    
    -- Configurações
    SETTINGS = {
        LOOP_DELAY = 35, -- Delay entre cada execução do evento
        RAID_MAP_ID = 1000002 -- ID do mapa de raid V1
    },
    
    -- Função principal do loop
    mainLoop = function(self)
        if not self.active then return end
        
        -- Executar o evento do raid V1
        local args = {self.SETTINGS.RAID_MAP_ID}
        pcall(function()
            ReplicatedStorage:WaitForChild("Remotes"):WaitForChild("EnterCityRaidMap"):FireServer(unpack(args))
            print("⚔️ Auto Raid V1 executado! Map ID: " .. self.SETTINGS.RAID_MAP_ID)
        end)
    end,
    
    -- Iniciar o auto raid V1
    start = function(self)
        if self.active then return end
        
        self.active = true
        
        print("🟢 Auto Raid V1 INICIADO!")
        print("Executando evento a cada " .. self.SETTINGS.LOOP_DELAY .. " segundos")
        
        -- Executar uma vez imediatamente ao iniciar
        self:mainLoop()
        
        -- Criar loop usando RunService
        self.connection = RunService.Heartbeat:Connect(function()
            if not self.active then return end
            pcall(function() self:mainLoop() end)
            wait(self.SETTINGS.LOOP_DELAY)
        end)
    end,
    
    -- Parar o auto raid V1
    stop = function(self)
        if not self.active then return end
        
        self.active = false
        
        if self.connection then
            self.connection:Disconnect()
            self.connection = nil
        end
        
        print("🔴 Auto Raid V1 PARADO!")
    end
}

-- SISTEMA AUTO RAID V2
local autoRaidV2System = {
    active = false,
    connection = nil,
    
    -- Configurações
    SETTINGS = {
        LOOP_DELAY = 35, -- Delay entre cada execução do evento
        RAID_MAP_ID = 1000001 -- ID do mapa de raid V2 (diferente do V1)
    },
    
    -- Função principal do loop
    mainLoop = function(self)
        if not self.active then return end
        
        -- Executar o evento do raid V2
        local args = {self.SETTINGS.RAID_MAP_ID}
        pcall(function()
            ReplicatedStorage:WaitForChild("Remotes"):WaitForChild("EnterCityRaidMap"):FireServer(unpack(args))
            print("⚔️ Auto Raid V2 executado! Map ID: " .. self.SETTINGS.RAID_MAP_ID)
        end)
    end,
    
    -- Iniciar o auto raid V2
    start = function(self)
        if self.active then return end
        
        self.active = true
        
        print("🟢 Auto Raid V2 INICIADO!")
        print("Executando evento a cada " .. self.SETTINGS.LOOP_DELAY .. " segundos")
        
        -- Executar uma vez imediatamente ao iniciar
        self:mainLoop()
        
        -- Criar loop usando RunService
        self.connection = RunService.Heartbeat:Connect(function()
            if not self.active then return end
            pcall(function() self:mainLoop() end)
            wait(self.SETTINGS.LOOP_DELAY)
        end)
    end,
    
    -- Parar o auto raid V2
    stop = function(self)
        if not self.active then return end
        
        self.active = false
        
        if self.connection then
            self.connection:Disconnect()
            self.connection = nil
        end
        
        print("🔴 Auto Raid V2 PARADO!")
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

-- Toggle Auto Raid V1
local AutoRaidToggle, AutoRaidBox = CriarToggle("Auto Raid V1", function() end)

AutoRaidToggle.MouseButton1Click:Connect(function()
    if autoRaidSystem.active then
        -- Desligar
        AutoRaidBox.BackgroundColor3 = Color3.fromRGB(40, 40, 40)
        autoRaidSystem:stop()
    else
        -- Ligar
        AutoRaidBox.BackgroundColor3 = Color3.fromRGB(0, 200, 0)
        autoRaidSystem:start()
    end
end)

-- Toggle Auto Raid V2
local AutoRaidV2Toggle, AutoRaidV2Box = CriarToggle("Auto Raid V2", function() end)

AutoRaidV2Toggle.MouseButton1Click:Connect(function()
    if autoRaidV2System.active then
        -- Desligar
        AutoRaidV2Box.BackgroundColor3 = Color3.fromRGB(40, 40, 40)
        autoRaidV2System:stop()
    else
        -- Ligar
        AutoRaidV2Box.BackgroundColor3 = Color3.fromRGB(0, 200, 0)
        autoRaidV2System:start()
    end
end)

local b1 = CriarBotao("potion luck v1", function()
	local args = {
	{
		id = 10047,
		count = 5
	}
}
game:GetService("ReplicatedStorage"):WaitForChild("Remotes"):WaitForChild("PotionMerge"):InvokeServer(unpack(args))
end)

local b1 = CriarBotao("potion damage v1", function()
	local args = {
	{
		id = 10048,
		count = 5
	}
}
game:GetService("ReplicatedStorage"):WaitForChild("Remotes"):WaitForChild("PotionMerge"):InvokeServer(unpack(args))
end)

local b1 = CriarBotao("potion Gold v1", function()
	local args = {
	{
		id = 10049,
		count = 5
	}
}
game:GetService("ReplicatedStorage"):WaitForChild("Remotes"):WaitForChild("PotionMerge"):InvokeServer(unpack(args))
end)

local AutoMythicalToggle, AutoMythicalBox = CriarToggle("auto chapéu 1", function() end)

local AutoMythicalChecked = false
AutoMythicalToggle.MouseButton1Click:Connect(function()
    AutoMythicalChecked = not AutoMythicalChecked
    if AutoMythicalChecked then
        AutoMythicalBox.BackgroundColor3 = Color3.fromRGB(0, 200, 0)
        _G.auto = true
        
        -- Iniciar loop do Auto Mythical
        task.spawn(function()
            while _G.auto do
                local args = {
	400001
}
game:GetService("ReplicatedStorage"):WaitForChild("Remotes"):WaitForChild("RerollOrnament"):InvokeServer(unpack(args))
                task.wait(0.2)
            end
        end)
    else
        AutoMythicalBox.BackgroundColor3 = Color3.fromRGB(40, 40, 40)
        _G.auto = false
    end
end)

local AutoMythicalToggle, AutoMythicalBox = CriarToggle("auto mochila 6", function() end)

local AutoMythicalChecked = false
AutoMythicalToggle.MouseButton1Click:Connect(function()
    AutoMythicalChecked = not AutoMythicalChecked
    if AutoMythicalChecked then
        AutoMythicalBox.BackgroundColor3 = Color3.fromRGB(0, 200, 0)
        _G.auto = true
        
        task.spawn(function()
            while _G.auto do
                local args = {
	400002
}
game:GetService("ReplicatedStorage"):WaitForChild("Remotes"):WaitForChild("RerollOrnament"):InvokeServer(unpack(args))
                task.wait(0.2)
            end
        end)
    else
        AutoMythicalBox.BackgroundColor3 = Color3.fromRGB(40, 40, 40)
        _G.auto = false
    end
end)

UIListLayout:GetPropertyChangedSignal("AbsoluteContentSize"):Connect(function()
    ContentContainer.CanvasSize = UDim2.new(0, 0, 0, UIListLayout.AbsoluteContentSize.Y)
    ajustarAlturaJanela() -- Ajusta a altura da janela automaticamente
end)

-- Ajustar altura inicial
task.wait(0.1)
ajustarAlturaJanela()

print("🚀 INTERFACE RN TEAM CARREGADA!")ços
