class Settings {
    // Layers are drawn in this order (earlier = further back). "UI" is always drawn last, in screen space.
    // NOTE: any layer a GameObject uses must be listed here or that object is never drawn.
    static layers = ["background", "default", "units", "UI"]
    //optional for letterboxing, ill put it in my rts why not

}
