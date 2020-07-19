var manager = new PanelsManager($("body"));

var main = manager.addPanelGroup("main", "VERTICAL");

var firstBar = main.addPanelGroup("firstBar", "HORIZONTAL");
firstBar.m_targetHeight = 0.6;
var effects = firstBar.addPanel("Panel 1", document.getElementById("pnl1"), ["first"], "Fenêtre des effets");
effects.m_targetWidth = 0.2;
var effects2 = firstBar.addPanel("Effect 2", document.getElementById("pnl2"), ["first"], "Fenêtre des effets 2");
effects2.m_targetWidth = 0.4;
var preview = firstBar.addPanel("preview", document.getElementById("pnl3"), ["second"], "Preview, là où on est censé voir le résultat du montage en temps réel (ahem)");

var secondBar = main.addPanelGroup("secibBar", "HORIZONTAL");
var medias = secondBar.addPanel("Medias", document.getElementById("pnl4"), ["second"], "Medias");
medias.m_targetWidth = 0.25;
var timeline = secondBar.addPanel("Timeline", document.getElementById("pnl5"), ["first"], "Timeline, là où on agence les clips etc...");

manager.update();



win1 = manager.addWindow(
    manager.getDOM(),
    {
        x: 100,
        y: 150
    },
    {
        width: 400,
        height: 200
    }
);

win2 = manager.addWindow(
    manager.getDOM(),
    {
        x: 500,
        y: 150
    },
    {
        width: 400,
        height: 200
    }
);