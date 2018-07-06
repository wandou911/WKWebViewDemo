//
//  JSBridgeViewController.m
//  WKWebViewDemo
//
//  Created by wandou on 2018/7/6.
//  Copyright © 2018 wandou. All rights reserved.
//

#import "JSBridgeViewController.h"
#import <WebKit/WebKit.h>
#import <WebViewJavascriptBridge/WebViewJavascriptBridge.h>

@interface JSBridgeViewController ()

@property (nonatomic, strong) WKWebView *webView;
@property (nonatomic, strong) WebViewJavascriptBridge *bridge;
@property (nonatomic, strong) UILabel *label;


@end

@implementation JSBridgeViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    [self createUI];
    
    [self loadLocalHtmlWithFileName:@"JSBridge"];
    //js 调用原生，获取数据,通过回调给JS
    [self.bridge registerHandler:@"JSCallOC" handler:^(id data, WVJBResponseCallback responseCallback) {
        self.label.text = [NSString stringWithFormat:@"%@,并准备向Object-C要一个苹果",data];
        responseCallback(@"并向Object-C要一个苹果");
    }];
}


- (void)createUI {
    WKWebViewConfiguration *config = [[WKWebViewConfiguration alloc] init];
    config.preferences.javaScriptEnabled = YES;
    config.preferences.javaScriptCanOpenWindowsAutomatically = YES;
    
    
    self.webView = [[WKWebView alloc] initWithFrame:CGRectMake(0, 20, CGRectGetWidth(self.view.bounds),CGRectGetHeight(self.view.bounds)-120) configuration:config];
    [self.view addSubview:self.webView];
    
    self.bridge = [WebViewJavascriptBridge bridgeForWebView:self.webView];
    
    self.label = [[UILabel alloc] initWithFrame:CGRectMake(0, CGRectGetMaxY(self.webView.frame), self.view.frame.size.width, 50)];
    self.label.numberOfLines = 0;
    self.label.adjustsFontSizeToFitWidth = YES;
    [self.view addSubview:self.label];
    
    UIButton *button = [[UIButton alloc] initWithFrame:CGRectMake(15, CGRectGetMaxY(self.label.frame), self.view.frame.size.width-30, 30)];
    
    [button setTitle:@"点我调用JS" forState:UIControlStateNormal];
    [button setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    [button setBackgroundColor:[UIColor blueColor]];
    [button addTarget:self action:@selector(click) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:button];
    
}

//原生调用JS
- (void)click {
    //[self.bridge callHandler:@"OCCallJS"];
    //[self.bridge callHandler:@"OCCallJS" data:@"Objective-C主动给JS一个苹果，并且不要回报"];
    [self.bridge callHandler:@"OCCallJS2" data:@"Object-C主动给JS一个苹果，并且不要回报" responseCallback:^(id responseData) {
        self.label.text = [NSString stringWithFormat:@"Object-C主动给JS一个苹果后，%@",responseData];
    }];
}

- (void)loadRequestWithRequestUrl:(NSString *)url {
    if (_webView) {
        [_webView loadRequest:[[NSURLRequest alloc] initWithURL:[NSURL URLWithString:url]]];
    }
}

- (void)loadLocalHtmlWithFileName:(NSString *)fileName {
    NSBundle *bundle = [NSBundle mainBundle];
    NSString *path = [bundle pathForResource:fileName ofType:@"html"];
    if (_webView) {
        [_webView loadFileURL:[NSURL fileURLWithPath:path] allowingReadAccessToURL:[bundle bundleURL]];
    }
}


- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}



@end
