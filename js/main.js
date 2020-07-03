var manager = new DocksManager($("body"));

var main = manager.addPanelGroup("main", "VERTICAL");

var firstBar = main.addPanelGroup("firstBar", "HORIZONTAL");
firstBar.m_targetHeight = 0.6;
var effects = firstBar.addPanel("Panel 1", ["first"], "Fenêtre des effets");
effects.m_targetWidth = 0.2;
var effects2 = firstBar.addPanel("Effetc 2", ["first"], "Fenêtre des effets 2");
effects2.m_targetWidth = 0.4;
var preview = firstBar.addPanel("preview", ["second"], "Preview, là où on est censé voir le résultat du montage en temps réel (ahem)");

var secondBar = main.addPanelGroup("secibBar", "HORIZONTAL");
var medias = secondBar.addPanel("Medias", ["second"], "Medias");
medias.m_targetWidth = 0.25;
var timeline = secondBar.addPanel("Timeline", ["first"], "Timeline, là où on agence les clips etc...");

manager.update();



win1 = new FloatingWindow(
    $("body"),
    {
        x: 100,
        y: 150
    },
    {
        width: 400,
        height: 200
    }
);
win1.update();