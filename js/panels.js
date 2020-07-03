//Enum orientation
//  HORIZONTAL
//  VERTICAL

class Panel
{
    constructor(parent) {
        this.m_parent = parent; // Parent object (common to PanelGroup) <Object>
        this.m_docked = true; // Window state (docked or not) <Boolean>
        this.m_height = 100; // Panel / Window height <Integer>
        this.m_width = 100; // Panel / Window width <Integer>
        this.m_targetWidth = 0.5; // Panel width percentage of parent <Float>
        this.m_targetHeight = 0.5; // Panel height percentage of parent <Float>
        this.m_incompressability = {height: 40, width: 40}; // Panel minimum size <{x:Integer y:Integer}>
    }
    getWidth() // Getter for m_width
    {
        return this.m_width;
    }    
    getHeight() // Getter for m_height
    {
        return this.m_height;
    }
    getTargetWidth() // Getter for m_targetWidth
    {
        return this.m_targetWidth;
    }
    getTargetHeight() // Getter for m_targetHeight
    {
        return this.m_targetHeight;
    }
}


class DockablePanel extends Panel // Base panel class
{
    /*
    DockablePanel is the key class
    It holds both Panel et Window features
    */
   constructor(parent, name, additionnalClasses) { // Constructor called during initialisation
    super()
    this.m_parent = parent;
    this.m_name = name; // Window name (used when window is undocked) <String>
    this.m_location = {x:0, y:0}; // Window location <{x:Integer, y:Integer}>
    this.m_classes = additionnalClasses; // Additionnal css classes <[String]>
    this.m_container = document.createElement("div"); // Panel DOM element <"object">
    this.m_container.classList.add("panel");                    // Add all the additionnal css classes to the panel DOM element
    for(var i in additionnalClasses)                            // ---
    {                                                           // ---
        this.m_container.classList.add(additionnalClasses[i]);  // ---
    }                                                           // ---
    }
    getIncompressability() // Getter for m_incompressability
    {
        return this.m_incompressability;
    }
    update() // Common update function
    {
    }    
    getDOM()
    {
        return this.m_container;
    }
}


class PanelSeparator
{
    constructor(parent, target1, target2, orientation) {
        var self = this;
        this.m_parent = parent;
        this.m_target1 = target1;
        this.m_target2 = target2;
        this.m_orientation = orientation;
        this.m_isHover = false;
        this.m_isSelected = false;
        this.m_container = document.createElement("div");
        this.m_container.classList.add("pnls-separator-container");
        parent.getDOM().appendChild(this.m_container);
        this.m_location = {x:0,y:0};
        this.m_thickness = 2;

        this.m_lastThickness = 0;

        if(this.m_orientation === "HORIZONTAL")
            $(this.m_container).css("cursor", "e-resize")
        else if(this.m_orientation === "VERTICAL")
            $(this.m_container).css("cursor", "n-resize")
        $(this.m_container).on("mouseenter", function(event) {
            this.m_isHover = true;
        });
        $(this.m_container).on("mouseleave", function(event) {
            self.m_isHover = false;
        })
        $(this.m_container).on("mousedown", function(event) {
            self.m_isSelected = true;
            if(self.m_orientation === "HORIZONTAL")
                self.m_lastThickness = self.m_target1.m_width + self.m_target2.m_width;
            else if(self.m_orientation == "VERTICAL")
                self.m_lastThickness = self.m_target1.m_height + self.m_target2.m_height;
        });
        $(this.m_container).on("contextmenu", function(event) {
            if(self.m_orientation==="HORIZONTAL")
            {
                new ContextMenu(false,
                    {
                        x: event.clientX,
                        y: event.clientY
                    },
                    {
                        "Ecraser gauche": {
                            callback: function() {
                                self.unSplit(true);
                            }
                        },
                        "Ecraser droite": {
                            callback: function() {
                                self.unSplit();
                            }
                        }
                });
            }
            else
            {
                new ContextMenu(false,
                    {
                        x: event.clientX,
                        y: event.clientY
                    },
                    {
                        "Ecraser haut": {
                            callback: function() {
                                self.unSplit(true);
                            }
                        },
                        "Ecraser bas": {
                            callback: function() {
                                self.unSplit();
                            }
                        }
                });                
            }
            event.preventDefault();
            event.stopPropagation();
        });
        $(document).on("mouseup", function(event) {
            self.m_isSelected = false;
        })
        $(document).on("mousemove", function(event) {
            if(self.m_isSelected)
            {
                if(self.m_orientation==="HORIZONTAL")
                {
                    if(((event.clientX - $(self.m_target1.getDOM()).offset().left) - (self.m_thickness/2)) > self.m_target1.getIncompressability().width)
                    {
                        self.m_target1.m_width = (event.clientX - $(self.m_target1.getDOM()).offset().left) - (self.m_thickness/2);
                    }
                    else
                    {
                        self.m_target1.m_width = self.m_target1.getIncompressability().width;
                    }
                    self.m_target1.m_targetWidth = self.m_target1.m_width / self.m_parent.m_width;

                    self.m_target2.m_width = self.m_lastThickness - self.m_target1.m_width;
                    self.m_target2.m_targetWidth = self.m_target2.m_width / self.m_parent.m_width;
                }
                else if(self.m_orientation==="VERTICAL")
                {
                    if(((event.clientY - $(self.m_target1.getDOM()).offset().top) - (self.m_thickness/2)) > self.m_target1.getIncompressability().height)
                    {
                        self.m_target1.m_height = (event.clientY - $(self.m_target1.getDOM()).offset().top) - (self.m_thickness/2);
                    }
                    else
                    {
                        self.m_target1.m_height = self.m_target1.getIncompressability().height;
                    }
                    self.m_target1.m_targetHeight = self.m_target1.m_height / self.m_parent.m_height;

                    self.m_target2.m_height = self.m_lastThickness - self.m_target1.m_height;
                    self.m_target2.m_targetHeight = self.m_target2.m_height / self.m_parent.m_height;
                }
                self.m_parent.update();
            }
        });
    }
    update()
    {
        if(this.m_orientation==="HORIZONTAL")
        {
            for(var i in this.m_parent.m_panels)
            {
                if(this.m_parent.m_panels[i]==this.m_target2)
                {
                    this.m_location.x = this.m_parent.m_panels[i].m_location.x - this.m_thickness/2;
                    break
                }
            }
            this.m_location.y = 0;
            $(this.m_container).css("left", this.m_location.x);
            $(this.m_container).css("height", this.m_parent.getHeight());
            $(this.m_container).css("width", this.m_thickness);
            //$(this.m_container).css("z-index", "-1");
        }
        else if(this.m_orientation==="VERTICAL")
        {
            for(var i in this.m_parent.m_panels)
            {
                if(this.m_parent.m_panels[i]==this.m_target2)
                {
                    this.m_location.y = this.m_parent.m_panels[i].m_location.y;
                    break
                }
            }
            this.m_location.x = 0;
            $(this.m_container).css("top", this.m_location.y);
            $(this.m_container).css("width", this.m_parent.getWidth());
            $(this.m_container).css("height", this.m_thickness);
            //$(this.m_container).css("z-index", "-1");
        }
    }
    unSplit(toLeft)
    {
        if(toLeft)
        {
            $(this.m_target1.getDOM()).remove(); // Remove the overriden pannel from DOM
            var stored = {
                width: this.m_target1.getWidth(),
                tWidth: this.m_target1.getTargetWidth(),
                height: this.m_target1.getHeight(),
                tHeight: this.m_target1.getTargetHeight()
            }

            var nSep = 0;
            var nSepIndex = 0;
            for(var i in this.m_parent.m_separators) // Find the new m_target1
            {
                if(this.m_parent.m_separators[i].m_target2 == this.m_target1)
                {
                    nSep = this.m_parent.m_separators[i];
                    nSepIndex = i;
                    break
                }
            }
            this.m_target1 = nSep.m_target1;
            //this.m_target1 = this.m_parent.m_panels[this.m_parent.m_panels.indexOf(this.m_target1)-1];

            //$(this.m_parent.m_separators[this.m_target1.m_parent.m_separators.indexOf(nSep)].m_container).remove(); // Remove old separator
            $(nSep.m_container).remove()
            this.m_parent.m_separators.splice(nSepIndex, 1);

            //this.m_parent.m_panels.splice(this.m_target1.m_parent.m_panels.indexOf(this.m_target1), 1);
            //this.m_parent.m_separators.splice(this.m_target1.m_parent.m_separators.indexOf(this)-1, 1);

            if(this.m_parent.m_orientation==="HORIZONTAL")
            {
                this.m_target1.m_width+=stored.width;
                this.m_target1.m_targetWidth+=stored.tWidth;
            }
            this.m_parent.update();
        }
        else
        {
            this.m_parent.m_panels.splice(this.m_target2.m_parent.m_panels.indexOf(this.m_target2), 1);
            this.m_parent.m_separators.splice(this.m_target2.m_parent.m_separators.indexOf(this), 1);
            $(this.m_container).remove();
            $(this.m_target2.getDOM()).remove();
            this.m_target1.m_parent.update();
        }
    }
}


class PanelGroup extends Panel
{
    constructor(parent, orientation) { // Constructor called during initialisation
        super()
        var self = this;
        this.m_parent = parent;
        this.m_container = document.createElement("div");
        parent.getDOM().appendChild(this.m_container);
        this.m_container.classList.add("pnls-panelGroup");
        this.m_orientation = orientation;
        //this.m_width = 600;
        //this.m_height = 600;

        //this.m_width = $(document).width();
        this.m_width = this.m_parent.getWidth();
        this.m_height = this.m_parent.getHeight();

        this.m_location = {x:0, y:0}; // Window location <{x:Integer, y:Integer}>

        this.m_fill = true;
        this.m_useAbsoluteThickness = false;

        this.m_panels = [];
        this.m_separators = [];
    }
    update() // Common update function
    {
        var cumulatedThickness=0;
        var maxThickness = 0;
        if(this.m_orientation==="HORIZONTAL")
        {
            var maxThickness = this.m_width;
        }
        else if(this.m_orientation==="VERTICAL")
        {
            var maxThickness = this.m_height;
        }
        for(var i in this.m_panels)
        {
            if(this.m_orientation==="HORIZONTAL")
            {
                maxThickness-=this.m_panels[i].getIncompressability().width;
            }
            else if(this.m_orientation==="VERTICAL")
            {
                maxThickness-=this.m_panels[i].getIncompressability().height;
            }
        }
        //console.log("new")
        //console.log(this.getDOM());
        //console.log(this.m_parent.getDOM());
        //console.log(this.m_width);
        if(this.m_panels.length>1)
        {
            for(var i in this.m_panels)
            {
                if(this.m_orientation==="HORIZONTAL")
                {
                    maxThickness+=this.m_panels[i].getIncompressability().width;
                    if(!this.m_useAbsoluteThickness)
                        var desiredWidth = this.m_panels[i].getTargetWidth() * this.m_width;
                    else
                        var desiredWidth = this.m_panels[i].getWidth();
                    var obtainedWidth = 0;
                    if(this.m_fill && i == this.m_panels.length-1)
                    {
                        obtainedWidth = maxThickness - cumulatedThickness;
                    }
                    else
                    {
                        if(cumulatedThickness+desiredWidth<=maxThickness)
                        {
                            if(desiredWidth > this.m_panels[i].getIncompressability().width)
                            {
                                obtainedWidth = desiredWidth;
                            }
                            else
                            {
                                obtainedWidth = this.m_panels[i].getIncompressability().width;
                                //obtainedWidth = 100;
                            }
                        }
                        else
                        {
                            obtainedWidth = maxThickness - cumulatedThickness;
                        }
                    }
                    this.m_panels[i].m_location = {x:cumulatedThickness, y:0};
                    this.m_panels[i].m_width = obtainedWidth;
                    this.m_panels[i].m_height = this.m_height;
                    $(this.m_panels[i].getDOM()).css("top", this.m_panels[i].m_location.y);
                    $(this.m_panels[i].getDOM()).css("left", cumulatedThickness);
                    $(this.m_panels[i].getDOM()).css("width", obtainedWidth);
                    $(this.m_panels[i].getDOM()).css("height", this.m_height);
                    cumulatedThickness+=obtainedWidth;
                }
                else if(this.m_orientation==="VERTICAL")
                {
                    maxThickness+=this.m_panels[i].getIncompressability().height;
                    if(!this.m_useAbsoluteThickness)
                        var desiredHeight = this.m_panels[i].getTargetHeight() * this.m_height;
                    else
                        var desiredHeight = this.m_panels[i].getHeight();
                    var obtainedHeight = 0;
                    if(this.m_fill && i == this.m_panels.length-1)
                    {
                        obtainedHeight = maxThickness - cumulatedThickness;
                    }
                    else
                    {
                        if(cumulatedThickness+desiredHeight<=maxThickness)
                        {
                            if(desiredHeight > this.m_panels[i].getIncompressability().height)
                            {
                                obtainedHeight = desiredHeight;
                            }
                            else
                            {
                                obtainedHeight = this.m_panels[i].getIncompressability().height;
                                //obtainedWidth = 100;
                            }
                        }
                        else
                        {
                            obtainedHeight = maxThickness - cumulatedThickness;
                        }
                    }
                    this.m_panels[i].m_location = {x:0, y:cumulatedThickness};
                    this.m_panels[i].m_height = obtainedHeight;
                    this.m_panels[i].m_width = this.m_width;
                    $(this.m_panels[i].getDOM()).css("top", cumulatedThickness);
                    $(this.m_panels[i].getDOM()).css("left", this.m_panels[i].m_location.x);
                    $(this.m_panels[i].getDOM()).css("width", this.m_width);
                    $(this.m_panels[i].getDOM()).css("height", obtainedHeight);
                    cumulatedThickness+=obtainedHeight;
                }
                this.m_panels[i].update();
            }
        }
        else
        {
            if(this.m_orientation==="HORIZONTAL")
            {
                this.m_panels[0].m_location = {x:0, y:0};
                this.m_panels[0].m_width = this.m_width;
                this.m_panels[0].m_height = this.m_height;
                $(this.m_panels[0].getDOM()).css("top", this.m_panels[0].m_location.y);
                $(this.m_panels[0].getDOM()).css("left", this.m_panels[0].m_location.x);
                $(this.m_panels[0].getDOM()).css("width", this.m_panels[0].m_width);
                $(this.m_panels[0].getDOM()).css("height", this.m_panels[0].m_height);
            }
            else
            {
                this.m_panels[0].m_location = {x:0, y:0};
                this.m_panels[0].m_width = this.m_width;
                this.m_panels[0].m_height = this.m_height;
                $(this.m_panels[0].getDOM()).css("top", this.m_panels[0].m_location.y);
                $(this.m_panels[0].getDOM()).css("left", this.m_panels[0].m_location.x);
                $(this.m_panels[0].getDOM()).css("width", this.m_panels[0].m_width);
                $(this.m_panels[0].getDOM()).css("height", this.m_panels[0].m_height);
            }
            this.m_panels[0].update()
        }
        for(var i in this.m_separators)
        {
            this.m_separators[i].update();
        }
    }
    getIncompressability() // Getter for m_incompressability
    {
        return this.m_incompressability;
    }
    getHeight() // Getter for m_height
    {
        return this.m_height;
    }
    getWidth() // Getter for m_width
    {
        return this.m_width;
    }
    addChild(newChild)
    {
        this.getDOM().appendChild(newChild.getDOM());
        this.m_panels.push(newChild);
        if(this.m_panels.length>1)
        {
            var tmpSeparator = new PanelSeparator(this, this.m_panels[this.m_panels.length-2], newChild, this.m_orientation);
            this.m_separators.push(tmpSeparator);
            tmpSeparator.update();
        }
    }
    css(arg1, arg2) // Simple passerelle trough jquery css property
    {
        $(this.m_container).css(arg1, arg2);
    }
    getDOM()
    {
        return this.m_container;
    }
    addPanel(name, additionnalClasses, inHtml)
    {
        var nPanel = new DockablePanel(this, name, additionnalClasses);
        nPanel.getDOM().innerHTML = inHtml;
        this.addChild(nPanel)
        //this.update();
        return nPanel;
    }
    addPanelGroup(name, ori, additionnalClasses)
    {
        var nGroup = new PanelGroup(this, ori);
        this.addChild(nGroup);
        return nGroup;
    }
}


class DocksManager
{
    constructor(DOMParent) { // Constructor called during initialisation
        var self = this;
        this.m_DOMParent = DOMParent;
        //this.m_container = new PanelGroup(document.body, "HORIZONTAL", true);
        //this.m_container.m_container.classList.add("pnls-borders");
        this.m_panels = [];
        this.m_container = this.addPanelGroup("main", "HORIZONTAL", []);
        window.addEventListener('resize', function(event){
            self.update();
            //self.m_container.m_width = self.getWidth();

            //self.update()
        })
    }
    addPanel(name, additionnalClasses, inHtml)
    {
        var nPanel = new DockablePanel(this.m_container, name, additionnalClasses);
        nPanel.getDOM().innerHTML = inHtml;
        this.m_container.m_panels.push(nGroup);
        //this.m_panels[0].addChild(nPanel)
        return nPanel;
    }
    addPanelGroup(name, ori, additionnalClasses)
    {
        if(this.m_container === undefined)
        {
            var nGroup = new PanelGroup(this, ori);
            this.m_panels.push(nGroup);
        }
        else
        {
            var nGroup = new PanelGroup(this.m_container, ori);
            this.m_container.m_panels.push(nGroup);
        }
        //this.getDOM().addChild(nGroup);
        return nGroup;
    }
    getDOM()
    {
        if(this.m_container===undefined)
        {
            return this.m_DOMParent[0];
        }
        //return this.m_DOMParent[0];
        else
        {
            return this.m_container.getDOM();
        }
    }
    update()
    {
        this.m_container.m_width = this.getWidth();
        this.m_container.m_height = this.getHeight();
        this.m_container.css("width", this.m_container.getWidth());
        this.m_container.css("height", this.m_container.getHeight());
        this.m_container.update();
    /*
    for(var i in this.m_panels)
        {
            this.m_panels[i].css("width", this.m_panels[i].getWidth());
            this.m_panels[i].css("height", this.m_panels[i].getHeight());
            this.m_panels[i].update();
        }
    */
    }
    getWidth()
    {
        return this.m_DOMParent[0].clientWidth;
    }
    getHeight()
    {
        return this.m_DOMParent[0].clientHeight;
    }
}


class PanelsManager {
    constructor() {
        this.m_docksManager;
        this.m_windows = [];
    }
    update()
    {
        for(var i in this.m_windows)
        {
            this.m_windows[i].update();
        }
    }
}



class FloatingWindow
{
    constructor(parent, location, size) {
        var self = this;
        this.m_parent = parent;
        this.m_location = {x:location.x, y:location.y};
        this.m_targetSize = {width: size.width, height: size.height};
        this.m_container = document.createElement("div");
        this.m_container.classList.add("pnls-floatingWindow");
        parent[0].appendChild(this.m_container);
        
        this.m_dragArea = document.createElement("div");
        this.m_dragArea.classList.add("pnls-floatingWindowDragArea");
        this.m_container.appendChild(this.m_dragArea);
        
        this.m_buttonsArea = document.createElement("div");
        this.m_buttonsArea.classList.add("pnls-floatingWindowBtnsArea");
        this.m_dragArea.appendChild(this.m_buttonsArea);
        
        this.m_minimizeBtn = document.createElement("div");
        this.m_minimizeBtn.classList.add("pnls-floatingWindowBtnsMinimize");
        this.m_buttonsArea.appendChild(this.m_minimizeBtn);
        
        this.m_maximizeBtn = document.createElement("div");
        this.m_maximizeBtn.classList.add("pnls-floatingWindowBtnsMaximize");
        this.m_buttonsArea.appendChild(this.m_maximizeBtn);
        
        this.m_closeBtn = document.createElement("div");
        this.m_closeBtn.classList.add("pnls-floatingWindowBtnsClose");
        this.m_buttonsArea.appendChild(this.m_closeBtn);
        
        
        this.m_isBeingDragged = false;
        this.m_dragOffset = {x: 0, y: 0};
        
        this.m_keepFullyInside = true;
        
        this.m_borderThickness = 10;
        this.m_hoveredBorder = "none";
        this.m_isBorderBeingDragged = false;

        this.m_isMaximized = false;
        this.m_preMaximizedInfos = {x:0, y:0, width:0, height:0};

        this.m_incompressability = {width: 10, height: 50};
        console.log(this.m_buttonsArea.offsetWidth);
        $(this.m_dragArea).on("mousedown", function(event) {
            self.m_dragOffset = {
                x: event.clientX - self.m_location.x,
                y: event.clientY - self.m_location.y
            }
            self.m_isBeingDragged = true;
        });
        $(this.m_dragArea).on("dblclick", function(event) {
            self.maximize();
        });

        $(document).on("mousedown", function(event) {
            if(self.m_hoveredBorder!="none")
            {
                if(self.m_incompressability.width < self.m_buttonsArea.offsetWidth)
                    self.m_incompressability.width = self.m_buttonsArea.offsetWidth;
                self.m_isBorderBeingDragged = true;
                self.m_dragOffset = {
                    x: event.clientX,
                    y: event.clientY,
                    width: self.m_targetSize.width,
                    height: self.m_targetSize.height
                }
            }
            else
            {
                self.m_isBorderBeingDragged = false;
            }
        })
        $(document).on("mouseup", function() {
            $(document.body).css("user-select", "auto");
            self.m_isBeingDragged = false;
            self.m_isBorderBeingDragged = false;
        })
        $(document).on("mousemove", function(event) {
            if(self.m_isBeingDragged)
            {
                $(document.body).css("user-select", "none");
                if(!self.m_keepFullyInside)
                {
                    self.m_location = {
                        x: event.clientX - self.m_dragOffset.x,
                        y: event.clientY - self.m_dragOffset.y,
                    }
                }
                else
                {
                    if(event.clientX - self.m_dragOffset.x < 0)
                    {
                        var tmpX = 0;
                    }
                    else if(event.clientX - self.m_dragOffset.x + self.m_targetSize.width > $(window).width())
                    {
                        var tmpX = $(window).width() - self.m_targetSize.width;
                    }
                    else
                    {
                        var tmpX = event.clientX - self.m_dragOffset.x;
                    }

                    if(event.clientY - self.m_dragOffset.y < 0)
                    {
                        //var tmpY = self.m_dragArea.height;
                        var tmpY = 0;
                    }
                    else if(event.clientY - self.m_dragOffset.y + self.m_targetSize.height > $(window).height())
                    {
                        var tmpY = $(window).height() - self.m_targetSize.height;
                    }
                    else
                    {
                        var tmpY = event.clientY - self.m_dragOffset.y;
                    }
                    self.m_location = {
                            x: tmpX,
                            y: tmpY,
                    }
                        
                }
                self.update()
            }
            else if(self.m_isBorderBeingDragged)
            {
                $(document.body).css("user-select", "none");
                if(self.m_hoveredBorder=="bottom")
                {
                    if(event.clientY - self.m_location.y>self.m_incompressability.height)
                    {
                        self.m_targetSize.height = event.clientY - self.m_location.y;
                        self.update();
                    }
                    else
                    {
                        self.m_targetSize.height = self.m_incompressability.height;
                        self.update();
                    }
                }
                else if(self.m_hoveredBorder=="right")
                {
                    if(event.clientX - self.m_location.x > self.m_incompressability.width)
                    {
                        self.m_targetSize.width = event.clientX - self.m_location.x;
                        self.update();
                    }
                    else
                    {
                        self.m_targetSize.width = self.m_incompressability.width;
                        self.update();
                    }
                }
                else if(self.m_hoveredBorder=="left")
                {
                    if((self.m_dragOffset.width + (self.m_dragOffset.x - event.clientX)) > self.m_incompressability.width)
                    {
                        self.m_location.x = event.clientX;
                        self.m_targetSize.width = self.m_dragOffset.width + (self.m_dragOffset.x - event.clientX);
                        self.update();
                    }
                    else
                    {
                        self.m_targetSize.width = self.m_incompressability.width;
                        self.m_location.x = self.m_dragOffset.x + (self.m_dragOffset.width - self.m_incompressability.width);
                        self.update();
                    }
                }
                else if(self.m_hoveredBorder=="bottomright")
                {
                    if(event.clientY - self.m_location.y>self.m_incompressability.height)
                    {
                        self.m_targetSize.height = event.clientY - self.m_location.y;
                        self.update();
                    }
                    else
                    {
                        self.m_targetSize.height = self.m_incompressability.height;
                        self.update();
                    }
                    if(event.clientX - self.m_location.x > self.m_incompressability.width)
                    {
                        self.m_targetSize.width = event.clientX - self.m_location.x;
                        self.update();
                    }
                    else
                    {
                        self.m_targetSize.width = self.m_incompressability.width;
                        self.update();
                    }
                }
                else if(self.m_hoveredBorder=="bottomleft")
                {
                    if(event.clientY - self.m_location.y>self.m_incompressability.height)
                    {
                        self.m_targetSize.height = event.clientY - self.m_location.y;
                        self.update();
                    }
                    else
                    {
                        self.m_targetSize.height = self.m_incompressability.height;
                        self.update();
                    }
                    if((self.m_dragOffset.width + (self.m_dragOffset.x - event.clientX)) > self.m_incompressability.width)
                    {
                        self.m_location.x = event.clientX;
                        self.m_targetSize.width = self.m_dragOffset.width + (self.m_dragOffset.x - event.clientX);
                        self.update();
                    }
                    else
                    {
                        self.m_targetSize.width = self.m_incompressability.width;
                        self.m_location.x = self.m_dragOffset.x + (self.m_dragOffset.width - self.m_incompressability.width);
                        self.update();
                    }
                }
            }
            else
            {
                if(event.clientX > self.m_location.x & event.clientX < (self.m_location.x + self.m_targetSize.width))
                {
                    if(event.clientY > (self.m_location.y+self.m_targetSize.height-self.m_borderThickness/2) && event.clientY < (self.m_location.y+self.m_targetSize.height+self.m_borderThickness/2))
                    {
                        if(event.clientX > (self.m_location.x-self.m_borderThickness/2) & event.clientX < (self.m_location.x+self.m_borderThickness/2))
                        {
                            document.body.style.cursor = 'ne-resize';
                            self.m_hoveredBorder = "bottomleft";
                        }
                        else if(event.clientX > (self.m_location.x+self.m_targetSize.width-self.m_borderThickness/2) & event.clientX < (self.m_location.x+self.m_targetSize.width+self.m_borderThickness/2))
                        {
                            document.body.style.cursor = 'se-resize';
                            self.m_hoveredBorder = "bottomright";
                            
                        }
                        else
                        {
                            document.body.style.cursor = 'n-resize';
                            self.m_hoveredBorder = "bottom";
                        }
                    }
                    else
                    {
                        document.body.style.cursor = 'default';
                        self.m_hoveredBorder = "none";
                    }
                }
                else if(event.clientY > self.m_location.y & event.clientY < (self.m_location.y + self.m_targetSize.height))
                {
                    if(event.clientX > (self.m_location.x-self.m_borderThickness/2) & event.clientX < (self.m_location.x+self.m_borderThickness/2))
                    {
                        //console.log("left")
                        document.body.style.cursor = 'e-resize';
                        self.m_hoveredBorder = "left";
                    }
                    else if(event.clientX > (self.m_location.x+self.m_targetSize.width-self.m_borderThickness/2) & event.clientX < (self.m_location.x+self.m_targetSize.width+self.m_borderThickness/2))
                    {
                        //console.log("right")
                        document.body.style.cursor = 'e-resize';
                        self.m_hoveredBorder = "right";
                    }
                    else
                    {
                        document.body.style.cursor = 'default';
                        self.m_hoveredBorder = "none";
                    }
                }
                else
                {
                    document.body.style.cursor = 'default';
                    self.m_hoveredBorder = "none";
                }
            }
        })
        $(this.m_closeBtn).on("click", function() {
            self.close();
        });
        $(this.m_maximizeBtn).on("click", function() {
            self.maximize();
        });
        $(this.m_minimizeBtn).on("click", function() {
            self.minimize();
        });
        window.addEventListener('resize', function(event){
            if(self.m_isMaximized)
            {
                self.m_location.x = 0;
                self.m_location.y = 0;
                self.m_targetSize.width = self.m_parent[0].offsetWidth;
                self.m_targetSize.height = self.m_parent[0].offsetHeight;    
                self.update();
            }
        })
    }
    update()
    {
        $(this.m_container).css("height", this.m_targetSize.height);
        $(this.m_container).css("width", this.m_targetSize.width);
        $(this.m_container).css("left", this.m_location.x);
        $(this.m_container).css("top", this.m_location.y);

        $(this.m_dragArea).css("left", -1);
        $(this.m_dragArea).css("top", -1);
        $(this.m_dragArea).css("height", 20);
        $(this.m_dragArea).css("width", this.m_targetSize.width+2);

        $(this.m_closeBtn).css("width", 30);

        $(this.m_maximizeBtn).css("width", 25);

        $(this.m_minimizeBtn).css("width", 30);
    }
    close()
    {
        $(this.m_container).remove();
    }
    maximize()
    {
        if(!this.m_isMaximized)
        {
            this.m_isMaximized = true;
            this.m_preMaximizedInfos.x = this.m_location.x;
            this.m_preMaximizedInfos.y = this.m_location.y;
            this.m_preMaximizedInfos.width = this.m_targetSize.width;
            this.m_preMaximizedInfos.height = this.m_targetSize.height;
            this.m_location.x = 0;
            this.m_location.y = 0;
            this.m_targetSize.width = this.m_parent[0].offsetWidth;
            this.m_targetSize.height = this.m_parent[0].offsetHeight;
            this.update();
        }
        else
        {
            this.m_isMaximized = false;
            this.m_location.x = this.m_preMaximizedInfos.x;
            this.m_location.y = this.m_preMaximizedInfos.y;
            this.m_targetSize.width = this.m_preMaximizedInfos.width;
            this.m_targetSize.height = this.m_preMaximizedInfos.height;
            this.update()
        }
    }
}



function ContextMenu(parent, loc, elements)
{
    var self = this;
    this.container = document.createElement("div");
    this.elements = [];
    this.destroy = function() {
        //$(this.container).remove();
        $(".contextMenuContainer").remove();
    };
    $(this.container).on("mouseleave", function() {
        $(".contextMenuContainer").remove();
    })
    if(parent!=false)
    {
        $(this.container).addClass("contextMenuContainer").appendTo($(parent));
    }
    else
    {
        $(this.container).addClass("contextMenuContainer").appendTo($("body"));
    }
    this.init = function() {
        var j = 0;
        for(var i in elements) {
            this.elements.push(new ContextMenuElement(this, {
                title: i,
                callback: elements[i].callback,
                additionalClasses: elements[i].additionalClasses
            }));
        }
        $(this.container).css("left", String(loc.x-10)+"px");
        if((loc.y+($(this.container).height()))>($(document).height()))
        {
            $(this.container).css("top", String(loc.y-(20+((loc.y-10+($(this.container).height()))-($(document).height()))))+"px");
        }
        else
        {
            $(this.container).css("top", String(loc.y-10)+"px");
        }
    }
    this.init()
    this.remove = function() {
        /*
        for(var i in this.elements) {
            this.elements[i].remove();
        }*/
        this.container.remove();
    }
}


function ContextMenuElement(ctxtMenu, infos)
{
    this.bg = document.createElement("div");
    this.bg.innerHTML = infos.title;
    this.init = function() {
        $(this.bg).addClass("contextMenuElement").appendTo($(ctxtMenu.container));
        for(var i in infos.additionalClasses)
        {
            $(this.bg).addClass(infos.additionalClasses[i]);
        }
    }
    this.init();
    $(this.bg).on("click", function() {
        ctxtMenu.remove();
        infos.callback();
    })
}