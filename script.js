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

-- Toggle Auto Raid World 3
local AutoRaidW3Toggle, AutoRaidW3Box = CriarToggle("auto raid World 3", function() end)

AutoRaidW3Toggle.MouseButton1Click:Connect(function()
    if _G.autoRaidW3 then
        -- Desligar
        AutoRaidW3Box.BackgroundColor3 = Color3.fromRGB(40, 40, 40)
        _G.autoRaidW3 = false
    else
        -- Ligar
        AutoRaidW3Box.BackgroundColor3 = Color3.fromRGB(0, 200, 0)
        _G.autoRaidW3 = true
        
        -- Iniciar loop do Auto Raid World 3
        task.spawn(function()
            while _G.autoRaidW3 do
                local args = {[1] = 1000001}
                game:GetService("ReplicatedStorage").Remotes.EnterCityRaidMap:FireServer(unpack(args))
                task.wait(80.0)
            end
        end)
    end
end)

-- Toggle Auto Raid World 7
local AutoRaidW7Toggle, AutoRaidW7Box = CriarToggle("auto raid World 7", function() end)

AutoRaidW7Toggle.MouseButton1Click:Connect(function()
    if _G.autoRaidW7 then
        -- Desligar
        AutoRaidW7Box.BackgroundColor3 = Color3.fromRGB(40, 40, 40)
        _G.autoRaidW7 = false
    else
        -- Ligar
        AutoRaidW7Box.BackgroundColor3 = Color3.fromRGB(0, 200, 0)
        _G.autoRaidW7 = true
        
        -- Iniciar loop do Auto Raid World 7
        task.spawn(function()
            while _G.autoRaidW7 do
                local args = {[1] = 1000002}
                game:GetService("ReplicatedStorage").Remotes.EnterCityRaidMap:FireServer(unpack(args))
                task.wait(80.0)
            end
        end)
    end
end)

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

-- Toggle Auto Chapéu
local AutoChapeuToggle, AutoChapeuBox = CriarToggle("auto chapéu", function() end)

AutoChapeuToggle.MouseButton1Click:Connect(function()
    if _G.autoChapeu then
        -- Desligar
        AutoChapeuBox.BackgroundColor3 = Color3.fromRGB(40, 40, 40)
        _G.autoChapeu = false
    else
        -- Ligar
        AutoChapeuBox.BackgroundColor3 = Color3.fromRGB(0, 200, 0)
        _G.autoChapeu = true
        
        -- Iniciar loop do Auto Chapéu
        task.spawn(function()
            while _G.autoChapeu do
                local args = {400001}
                game:GetService("ReplicatedStorage"):WaitForChild("Remotes"):WaitForChild("RerollOrnament"):InvokeServer(unpack(args))
                task.wait(0.2)
            end
        end)
    end
end)

-- Toggle Auto Mochila
local AutoMochilaToggle, AutoMochilaBox = CriarToggle("auto mochila", function() end)

AutoMochilaToggle.MouseButton1Click:Connect(function()
    if _G.autoMochila then
        -- Desligar
        AutoMochilaBox.BackgroundColor3 = Color3.fromRGB(40, 40, 40)
        _G.autoMochila = false
    else
        -- Ligar
        AutoMochilaBox.BackgroundColor3 = Color3.fromRGB(0, 200, 0)
        _G.autoMochila = true
        
        task.spawn(function()
            while _G.autoMochila do
                local args = {400002}
                game:GetService("ReplicatedStorage"):WaitForChild("Remotes"):WaitForChild("RerollOrnament"):InvokeServer(unpack(args))
                task.wait(0.2)
            end
        end)
    end
end)

-- Botões de Potion
local b1 = CriarBotao("potion luck v1", function()
    local args = {
        {
            id = 10047,
            count = 5
        }
    }
    game:GetService("ReplicatedStorage"):WaitForChild("Remotes"):WaitForChild("PotionMerge"):InvokeServer(unpack(args))
end)

local b2 = CriarBotao("potion damage v1", function()
    local args = {
        {
            id = 10048,
            count = 5
        }
    }
    game:GetService("ReplicatedStorage"):WaitForChild("Remotes"):WaitForChild("PotionMerge"):InvokeServer(unpack(args))
end)

local b3 = CriarBotao("potion Gold v1", function()
    local args = {
        {
            id = 10049,
            count = 5
        }
    }
    game:GetService("ReplicatedStorage"):WaitForChild("Remotes"):WaitForChild("PotionMerge"):InvokeServer(unpack(args))
end)

local b2 = CriarBotao("auto click beta", function()
    _G.auto = true

while _G.auto do
local args = {
	{
		attackEnemyGUID = "3b887f80-7ae5-42ad-8915-73f94f2c87e1"
	}
}
game:GetService("ReplicatedStorage"):WaitForChild("Remotes"):WaitForChild("PlayerClickAttackSkill"):FireServer(unpack(args))
    wait(-999999)
end
end)

-- Caixa de Walk Speed com limite de 120
local WalkContainer = Instance.new("Frame")
WalkContainer.Size = UDim2.new(1, 0, 0, 30)
WalkContainer.BackgroundTransparency = 1
WalkContainer.ZIndex = 1
WalkContainer.Parent = ContentContainer

local WalkLabel = Instance.new("TextLabel")
WalkLabel.Size = UDim2.new(0.6, 0, 1, 0)
WalkLabel.BackgroundTransparency = 1
WalkLabel.Text = "Walk Speed"
WalkLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
WalkLabel.Font = Enum.Font.SourceSansBold
WalkLabel.TextSize = 18
WalkLabel.TextXAlignment = Enum.TextXAlignment.Left
WalkLabel.ZIndex = 1
WalkLabel.Parent = WalkContainer

local WalkBox = Instance.new("TextBox")
WalkBox.Size = UDim2.new(0.3, 0, 1, 0)
WalkBox.Position = UDim2.new(0.65, 0, 0, 0)
WalkBox.BackgroundColor3 = Color3.fromRGB(60, 60, 60)
WalkBox.BorderSizePixel = 0
WalkBox.Text = "16"
WalkBox.PlaceholderText = "0-120"
WalkBox.TextColor3 = Color3.fromRGB(255, 255, 255)
WalkBox.Font = Enum.Font.SourceSansBold
WalkBox.TextSize = 16
WalkBox.ZIndex = 1
WalkBox.Parent = WalkContainer
Instance.new("UICorner", WalkBox).CornerRadius = UDim.new(0, 6)

-- Efeitos visuais na TextBox
WalkBox.Focused:Connect(function()
    local tween = TweenService:Create(
        WalkBox,
        TweenInfo.new(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out),
        {BackgroundColor3 = Color3.fromRGB(80, 80, 80)}
    )
    tween:Play()
end)

WalkBox.FocusLost:Connect(function()
    local tween = TweenService:Create(
        WalkBox,
        TweenInfo.new(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out),
        {BackgroundColor3 = Color3.fromRGB(60, 60, 60)}
    )
    tween:Play()
    
    local val = tonumber(WalkBox.Text)
    if val then
        if val >= 0 and val <= 120 then
            -- Aplica a velocidade no personagem
            local character = LocalPlayer.Character
            if character and character:FindFirstChild("Humanoid") then
                character.Humanoid.WalkSpeed = val
                print("🟢 Walk Speed: " .. val)
            end
        else
            WalkBox.Text = "16"
            -- Restaura velocidade padrão
            local character = LocalPlayer.Character
            if character and character:FindFirstChild("Humanoid") then
                character.Humanoid.WalkSpeed = 16
            end
        end
    else
        WalkBox.Text = "16"
    end
end)

-- Sistema de Hitbox Size com limite de 60
local HitboxContainer = Instance.new("Frame")
HitboxContainer.Size = UDim2.new(1, 0, 0, 30)
HitboxContainer.BackgroundTransparency = 1
HitboxContainer.ZIndex = 1
HitboxContainer.Parent = ContentContainer

local HitboxLabel = Instance.new("TextLabel")
HitboxLabel.Size = UDim2.new(0.6, 0, 1, 0)
HitboxLabel.BackgroundTransparency = 1
HitboxLabel.Text = "kill aura"
HitboxLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
HitboxLabel.Font = Enum.Font.SourceSansBold
HitboxLabel.TextSize = 18
HitboxLabel.TextXAlignment = Enum.TextXAlignment.Left
HitboxLabel.ZIndex = 1
HitboxLabel.Parent = HitboxContainer

local HitboxBox = Instance.new("TextBox")
HitboxBox.Size = UDim2.new(0.3, 0, 1, 0)
HitboxBox.Position = UDim2.new(0.65, 0, 0, 0)
HitboxBox.BackgroundColor3 = Color3.fromRGB(60, 60, 60)
HitboxBox.BorderSizePixel = 0
HitboxBox.Text = "0"
HitboxBox.PlaceholderText = "0-2000"
HitboxBox.TextColor3 = Color3.fromRGB(255, 255, 255)
HitboxBox.Font = Enum.Font.SourceSansBold
HitboxBox.TextSize = 16
HitboxBox.ZIndex = 1
HitboxBox.Parent = HitboxContainer
Instance.new("UICorner", HitboxBox).CornerRadius = UDim.new(0, 6)

-- Efeitos visuais na HitboxBox
HitboxBox.Focused:Connect(function()
    local tween = TweenService:Create(
        HitboxBox,
        TweenInfo.new(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out),
        {BackgroundColor3 = Color3.fromRGB(80, 80, 80)}
    )
    tween:Play()
end)

HitboxBox.FocusLost:Connect(function()
    local tween = TweenService:Create(
        HitboxBox,
        TweenInfo.new(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out),
        {BackgroundColor3 = Color3.fromRGB(60, 60, 60)}
    )
    tween:Play()
    
    local val = tonumber(HitboxBox.Text)
    if val then
        if val == 0 then
            print("🔴 Hitbox Size DESATIVADO")
            _G.HitboxEnabled = false
        elseif val > 0 and val <= 2000 then
            _G.HitboxSize = val
            _G.HitboxEnabled = true
            print("🟢 Hitbox Size: " .. val)
        else
            HitboxBox.Text = "0"
            _G.HitboxSize = 0
        end
    else
        HitboxBox.Text = "0"
        _G.HitboxSize = 0
    end
end)

-- Configurações do sistema de Hitbox
_G.HitboxSize = 0
_G.HitboxEnabled = true
_G.NPCFolder = workspace.Enemys -- Pasta onde os NPCs estão

-- Função para modificar a HumanoidRootPart dos NPCs (apenas tamanho)
local function modifyNPCs()
    for _, npc in pairs(_G.NPCFolder:GetChildren()) do
        if npc:IsA("Model") and npc:FindFirstChild("HumanoidRootPart") then
            pcall(function()
                if _G.HitboxEnabled then
                    npc.HumanoidRootPart.Size = Vector3.new(_G.HitboxSize, _G.HitboxSize, _G.HitboxSize)
                    npc.HumanoidRootPart.CanCollide = false
                else
                    -- Restaura o tamanho original quando desativado
                    npc.HumanoidRootPart.Size = Vector3.new(2, 2, 1)
                    npc.HumanoidRootPart.CanCollide = true
                end
            end)
        end
    end
end

-- Loop para modificar os NPCs continuamente
game:GetService('RunService').RenderStepped:Connect(function()
    pcall(function()
        modifyNPCs()
    end)
end)

UIListLayout:GetPropertyChangedSignal("AbsoluteContentSize"):Connect(function()
    ContentContainer.CanvasSize = UDim2.new(0, 0, 0, UIListLayout.AbsoluteContentSize.Y)
    ajustarAlturaJanela() -- Ajusta a altura da janela automaticamente
end)

-- Ajustar altura inicial
task.wait(0.1)
ajustarAlturaJanela()

print("🚀 INTERFACE RN TEAM CARREGADA!")

