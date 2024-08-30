<script lang="ts">
    // TODO: make each preview row a component with columns
    // this will make it more versatile and easy to customize
    // ideally add checkboxes underneath the preview letting
    // users hide parts of the preview

    // TODO: also extract out the preview window generally
    // I've used it like 4 times now
</script>


<div class="preview">
    <div class="row prompt">
        <span class="p2 bold">ghostty@macos</span>
        <span class="fg">:</span>
        <span class="p6">~</span>
        <span class="fg">$</span>
        eza -la --color=always --icons
    </div>
    <div class="row">&nbsp;</div>
    <div class="row">
        <span class="p12">d</span>
        <span class="p11">r</span>
        <span class="p9">w</span>
        <span class="p10">x</span>
        <span class="p8">------</span>
        <span class="p8">&nbsp;&nbsp;&nbsp;&nbsp;-</span>
        <span>&nbsp;</span>
        <span class="p11">ghostty</span>
        <span>&nbsp;</span>
        <span class="date p4">22 Aug 13:42</span>
        <span>&nbsp;</span>
        <span class="p4"> .cache</span>
    </div>
    <div class="row">
        <span class="p12">d</span>
        <span class="p11">r</span>
        <span class="p9">w</span>
        <span class="p10">x</span>
        <span class="p8">------</span>
        <span class="p8">&nbsp;&nbsp;&nbsp;&nbsp;-</span>
        <span>&nbsp;</span>
        <span class="p11">ghostty</span>
        <span>&nbsp;</span>
        <span class="date p4">22 Aug 13:42</span>
        <span>&nbsp;</span>
        <span class="p4"> .config</span>
    </div>
    <div class="row">
        <span class="p7">.</span>
        <span class="p11">r</span>
        <span class="p9">w</span>
        <span class="p8">-</span>
        <span class="p3">r</span>
        <span class="p8">-</span>
        <span class="p8">-</span>
        <span class="p3">r</span>
        <span class="p8">-</span>
        <span class="p8">-</span>
        <span class="p2">&nbsp;&nbsp&nbsp;&nbsp;0</span>
        <span>&nbsp;</span>
        <span class="p11">ghostty</span>
        <span>&nbsp;</span>
        <span class="date p4">&nbsp;7 May 11:11</span>
        <span>&nbsp;</span>
        <span class="p7"> .hushlogin</span>
    </div>
    <div class="row">
        <span class="p7">.</span>
        <span class="p11">r</span>
        <span class="p9">w</span>
        <span class="p8">-------</span>
        <span class="p10">&nbsp;2.5k</span>
        <span>&nbsp;</span>
        <span class="p11">ghostty</span>
        <span>&nbsp;</span>
        <span class="date p4">&nbsp;2 Mar 02:49</span>
        <span>&nbsp;</span>
        <span class="p7"> .viminfo</span>
    </div>
    <div class="row">
        <span class="p12">l</span>
        <span class="p11">r</span>
        <span class="p9">w</span>
        <span class="p10">x</span>
        <span class="p3">r</span>
        <span class="p1">w</span>
        <span class="p2">x</span>
        <span class="p3">r</span>
        <span class="p1">w</span>
        <span class="p2">x</span>
        <span class="p8">&nbsp;&nbsp;&nbsp;&nbsp;-</span>
        <span>&nbsp;</span>
        <span class="p11">ghostty</span>
        <span>&nbsp;</span>
        <span class="date p4">&nbsp;9 Feb 20:32</span>
        <span>&nbsp;</span>
        <span class="p6"> etc -> /etc</span>
    </div>
    <div class="row">
        <span class="p7">.</span>
        <span class="p11">r</span>
        <span class="p9">w</span>
        <span class="p10">x</span>
        <span class="p3">r</span>
        <span class="p8">-</span>
        <span class="p2">x</span>
        <span class="p3">r</span>
        <span class="p8">-</span>
        <span class="p2">x</span>
        <span class="p2">&nbsp;&nbsp;12k</span>
        <span>&nbsp;</span>
        <span class="p11">ghostty</span>
        <span>&nbsp;</span>
        <span class="date p4">15 Jun 10:45</span>
        <span>&nbsp;</span>
        <span class="p10"> lsix</span>
    </div>
</div>

<style>
.preview {
    background: var(--config-bg);
    font-family: var(--config-font-family);
    font-size: var(--config-font-size);
    color: var(--config-fg);
    max-height: 200px;
    overflow-y: auto;
    padding: 8px;
    border-radius: var(--radius-level-3);
    border: 1px solid rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.5) inset;
}

.preview .row,
.prompt,
.date {
    display: flex;
    white-space: pre;
    /* width: 100%; */
    /* overflow: hidden; */
}

.bold {font-weight: 700;}

.fg {color: var(--config-fg);}

/* .p0 {color: var(--config-palette-0);} */
.p1 {color: var(--config-palette-1);}
.p2 {color: var(--config-palette-2);}
.p3 {color: var(--config-palette-3);}
.p4 {color: var(--config-palette-4);}
/* .p5 {color: var(--config-palette-5);} */
.p6 {color: var(--config-palette-6);}
.p7 {color: var(--config-palette-7);}
.p8 {color: var(--config-palette-8);}
.p9 {color: var(--config-palette-9);}
.p10 {color: var(--config-palette-10);}
.p11 {color: var(--config-palette-11);}
.p12 {color: var(--config-palette-12);}
/* .p13 {color: var(--config-palette-13);}
.p14 {color: var(--config-palette-14);}
.p15 {color: var(--config-palette-15);} */
</style>